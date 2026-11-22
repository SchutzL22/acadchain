import hre from "hardhat";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { keccak256, stringToHex } from "viem";
import { createHash } from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função de canonicalização RFC 8785 determinística (idêntica ao backend)
function computeCanonicalSha256(data: {
  schemaVersion: '1.0';
  documentoId: string;
  tipoDocumento: string;
  instituicaoSigla: string;
  instituicaoCodigoMec: string;
  estudanteCpf: string;
  estudanteNome: string;
  cursoNome: string;
  numeroMatricula: string;
  dataEmissao: string;
}): string {
  const normalized = {
    cursoNome: data.cursoNome.normalize('NFC').trim(),
    dataEmissao: data.dataEmissao.trim(),
    documentoId: data.documentoId.toLowerCase().trim(),
    estudanteCpf: data.estudanteCpf.replace(/\D/g, ''),
    estudanteNome: data.estudanteNome.normalize('NFC').trim(),
    instituicaoCodigoMec: data.instituicaoCodigoMec.trim(),
    instituicaoSigla: data.instituicaoSigla.toUpperCase().trim(),
    numeroMatricula: data.numeroMatricula.trim(),
    schemaVersion: '1.0' as const,
    tipoDocumento: data.tipoDocumento,
  };

  const keys = Object.keys(normalized).sort() as (keyof typeof normalized)[];
  const canonicalEntries = keys.map((key) => `"${key}":"${normalized[key]}"`);
  const canonicalString = `{${canonicalEntries.join(',')}}`;

  return createHash('sha256').update(canonicalString, 'utf8').digest('hex');
}

async function main() {
  console.log("=======================================================");
  console.log("  Iniciando Deploy do AcademicCredentialRegistry (v2)...");
  console.log("=======================================================");

  const conn = await hre.network.getOrCreate();
  const walletClients = await conn.viem.getWalletClients();
  const publicClient = await conn.viem.getPublicClient();

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
  const registry = await conn.viem.deployContract("AcademicCredentialRegistry", [], {
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

  // Emissão de credenciais de demonstração com HASHES CALCULADOS EM TEMPO REAL via canonicalização
  console.log("[Deploy] Calculando hashes canônicos e emitindo credenciais de demonstração...");

  // 1. Diploma UFS (Carlos Eduardo Moreira)
  const hash1Hex = computeCanonicalSha256({
    schemaVersion: '1.0',
    documentoId: 'a1b2c3d4-e5f6-47a8-b9c0-111111111111',
    tipoDocumento: 'DIPLOMA',
    instituicaoSigla: 'UFS',
    instituicaoCodigoMec: 'IES-901',
    estudanteCpf: '222.333.444-55',
    estudanteNome: 'Carlos Eduardo Moreira',
    cursoNome: 'Sistemas de Informação',
    numeroMatricula: 'UFS-2019-SI-045',
    dataEmissao: '2023-12-18',
  });
  const credId1 = keccak256(stringToHex('a1b2c3d4-e5f6-47a8-b9c0-111111111111'));
  const tx1 = await registry.write.issueCredential([credId1, ("0x" + hash1Hex) as `0x${string}`], { account: ufs.account });
  console.log(`[Deploy] Credencial 1 (Diploma UFS) emitida: tx ${tx1} (hash: ${hash1Hex})`);

  // 2. Carteirinha UFS (Ana Beatriz Silveira)
  const hash2Hex = computeCanonicalSha256({
    schemaVersion: '1.0',
    documentoId: 'b2c3d4e5-f6a7-48b9-c0d1-222222222222',
    tipoDocumento: 'CARTEIRINHA',
    instituicaoSigla: 'UFS',
    instituicaoCodigoMec: 'IES-901',
    estudanteCpf: '111.222.333-44',
    estudanteNome: 'Ana Beatriz Silveira',
    cursoNome: 'Ciência da Computação',
    numeroMatricula: 'UFS-2021-CC-001',
    dataEmissao: '2026-01-10',
  });
  const credId2 = keccak256(stringToHex('b2c3d4e5-f6a7-48b9-c0d1-222222222222'));
  const tx2 = await registry.write.issueCredential([credId2, ("0x" + hash2Hex) as `0x${string}`], { account: ufs.account });
  console.log(`[Deploy] Credencial 2 (Carteirinha UFS) emitida: tx ${tx2} (hash: ${hash2Hex})`);

  // 3. Certificado ITB (Fernanda Cristina Dias)
  const hash3Hex = computeCanonicalSha256({
    schemaVersion: '1.0',
    documentoId: 'c3d4e5f6-a7b8-49c0-d1e2-333333333333',
    tipoDocumento: 'CERTIFICADO',
    instituicaoSigla: 'ITB',
    instituicaoCodigoMec: 'IES-902',
    estudanteCpf: '555.666.777-88',
    estudanteNome: 'Fernanda Cristina Dias',
    cursoNome: 'Inteligência Artificial Aplicada',
    numeroMatricula: 'ITB-2023-IA-501',
    dataEmissao: '2024-06-25',
  });
  const credId3 = keccak256(stringToHex('c3d4e5f6-a7b8-49c0-d1e2-333333333333'));
  const tx3 = await registry.write.issueCredential([credId3, ("0x" + hash3Hex) as `0x${string}`], { account: itb.account });
  console.log(`[Deploy] Credencial 3 (Certificado ITB) emitida: tx ${tx3} (hash: ${hash3Hex})`);

  // 4. Carteirinha ITB (Daniela Martins Rocha)
  const hash4Hex = computeCanonicalSha256({
    schemaVersion: '1.0',
    documentoId: 'd4e5f6a7-b8c9-40d1-e2f3-444444444444',
    tipoDocumento: 'CARTEIRINHA',
    instituicaoSigla: 'ITB',
    instituicaoCodigoMec: 'IES-902',
    estudanteCpf: '333.444.555-66',
    estudanteNome: 'Daniela Martins Rocha',
    cursoNome: 'Engenharia de Software',
    numeroMatricula: 'ITB-2022-ES-102',
    dataEmissao: '2026-02-01',
  });
  const credId4 = keccak256(stringToHex('d4e5f6a7-b8c9-40d1-e2f3-444444444444'));
  const tx4 = await registry.write.issueCredential([credId4, ("0x" + hash4Hex) as `0x${string}`], { account: itb.account });
  console.log(`[Deploy] Credencial 4 (Carteirinha ITB) emitida: tx ${tx4} (hash: ${hash4Hex})`);

  // Carregar ABI do artefato compilado
  const artifactPath = path.resolve(__dirname, "../artifacts/contracts/AcademicCredentialRegistry.sol/AcademicCredentialRegistry.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const manifest = {
    chainId: 31337,
    networkName: "Hardhat 3 Local (EDR/EVM)",
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

  const rootDir = path.resolve(__dirname, "../..");
  const manifestDirs = [
    path.resolve(rootDir, "dados"),
    path.resolve(rootDir, "backend/src/config"),
  ];

  for (const dir of manifestDirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.resolve(dir, "contract-manifest.json"), JSON.stringify(manifest, null, 2));
  }

  console.log("[Deploy] Manifesto v2 gerado com sucesso em dados/contract-manifest.json e backend/src/config/contract-manifest.json");
  console.log("=======================================================");
  console.log("  Deploy e inicialização concluídos com sucesso!");
  console.log("=======================================================");
}

main().catch((error) => {
  console.error("[Deploy] Erro fatal durante o deploy:", error);
  process.exit(1);
});
