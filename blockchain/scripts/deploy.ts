import hre from "hardhat";
import fs from "node:fs";
import path from "node:path";
import { keccak256, toHex, stringToHex, pad } from "viem";

async function main() {
  console.log("=======================================================");
  console.log("  Iniciando Deploy do AcademicCredentialRegistry...");
  console.log("=======================================================");

  const walletClients = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();

  if (walletClients.length < 4) {
    throw new Error("São necessárias ao menos 4 contas locais para o consórcio de teste.");
  }

  const admin = walletClients[0];
  const ufs = walletClients[1];
  const itb = walletClients[2];
  const pui = walletClients[3];

  console.log(`[Deploy] Admin: ${admin.account.address}`);
  console.log(`[Deploy] UFS:   ${ufs.account.address}`);
  console.log(`[Deploy] ITB:   ${itb.account.address}`);
  console.log(`[Deploy] PUI:   ${pui.account.address}`);

  // Deploy do contrato
  const registry = await hre.viem.deployContract("AcademicCredentialRegistry", [], {
    account: admin.account,
  });

  const contractAddress = registry.address;
  const currentBlock = await publicClient.getBlockNumber();
  console.log(`[Deploy] Contrato implantado com sucesso em: ${contractAddress}`);
  console.log(`[Deploy] Bloco de deploy: ${currentBlock}`);

  // Autorizar as 3 instituições no consórcio
  console.log("[Deploy] Registrando instituições autorizadas no smart contract...");
  await registry.write.authorizeIssuer([ufs.account.address, "Universidade Federal do Saber (UFS)"], {
    account: admin.account,
  });
  await registry.write.authorizeIssuer([itb.account.address, "Instituto Tecnológico do Brasil (ITB)"], {
    account: admin.account,
  });
  await registry.write.authorizeIssuer([pui.account.address, "Pontifícia Universidade Integrada (PUI)"], {
    account: admin.account,
  });
  console.log("[Deploy] Instituições autorizadas com sucesso.");

  // Emissão de credenciais de demonstração sincronizadas com o banco SQLite
  console.log("[Deploy] Emitindo credenciais de demonstração na blockchain...");

  // 1. Diploma UFS (Carlos Eduardo Moreira)
  // UUID: a1b2c3d4-e5f6-47a8-b9c0-111111111111
  // Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  const credId1 = keccak256(stringToHex("a1b2c3d4-e5f6-47a8-b9c0-111111111111"));
  const hash1 = ("0x" + "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855") as `0x${string}`;
  const tx1 = await registry.write.issueCredential([credId1, hash1], { account: ufs.account });
  console.log(`[Deploy] Credencial 1 (Diploma UFS) emitida: tx ${tx1}`);

  // 2. Carteirinha UFS (Ana Beatriz Silveira)
  // UUID: b2c3d4e5-f6a7-48b9-c0d1-222222222222
  const credId2 = keccak256(stringToHex("b2c3d4e5-f6a7-48b9-c0d1-222222222222"));
  const hash2 = ("0x" + "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb") as `0x${string}`;
  const tx2 = await registry.write.issueCredential([credId2, hash2], { account: ufs.account });
  console.log(`[Deploy] Credencial 2 (Carteirinha UFS) emitida: tx ${tx2}`);

  // 3. Certificado ITB (Fernanda Cristina Dias)
  // UUID: c3d4e5f6-a7b8-49c0-d1e2-333333333333
  const credId3 = keccak256(stringToHex("c3d4e5f6-a7b8-49c0-d1e2-333333333333"));
  const hash3 = ("0x" + "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce") as `0x${string}`;
  const tx3 = await registry.write.issueCredential([credId3, hash3], { account: itb.account });
  console.log(`[Deploy] Credencial 3 (Certificado ITB) emitida: tx ${tx3}`);

  // 4. Carteirinha ITB (Daniela Martins Rocha)
  // UUID: d4e5f6a7-b8c9-40d1-e2f3-444444444444
  const credId4 = keccak256(stringToHex("d4e5f6a7-b8c9-40d1-e2f3-444444444444"));
  const hash4 = ("0x" + "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a") as `0x${string}`;
  const tx4 = await registry.write.issueCredential([credId4, hash4], { account: itb.account });
  console.log(`[Deploy] Credencial 4 (Carteirinha ITB) emitida: tx ${tx4}`);

  // Carregar ABI do artefato compilado
  const artifactPath = path.resolve(__dirname, "../artifacts/contracts/AcademicCredentialRegistry.sol/AcademicCredentialRegistry.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const manifest = {
    chainId: 31337,
    networkName: "Hardhat Local (EVM)",
    contractAddress,
    deployerAddress: admin.account.address,
    deploymentBlock: Number(currentBlock),
    deployedAt: new Date().toISOString(),
    issuers: [
      { id: 1, sigla: "UFS", nome: "Universidade Federal do Saber", address: ufs.account.address, role: "EMISSOR_AUTORIZADO" },
      { id: 2, sigla: "ITB", nome: "Instituto Tecnológico do Brasil", address: itb.account.address, role: "EMISSOR_AUTORIZADO" },
      { id: 3, sigla: "PUI", nome: "Pontifícia Universidade Integrada", address: pui.account.address, role: "EMISSOR_AUTORIZADO" },
    ],
    abi: artifact.abi,
  };

  // Salvar manifesto em dados/ e no backend para consulta imediata
  const rootDir = path.resolve(__dirname, "../..");
  const manifestDirs = [
    path.resolve(rootDir, "dados"),
    path.resolve(rootDir, "backend/src/config"),
  ];

  for (const dir of manifestDirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.resolve(dir, "contract-manifest.json"), JSON.stringify(manifest, null, 2));
  }

  console.log("[Deploy] Manifesto gerado com sucesso em dados/contract-manifest.json e backend/src/config/contract-manifest.json");
  console.log("=======================================================");
  console.log("  Deploy e inicialização concluídos com sucesso!");
  console.log("=======================================================");
}

main().catch((error) => {
  console.error("[Deploy] Erro fatal durante o deploy:", error);
  process.exit(1);
});
