import { describe, it } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";
import { keccak256, toHex, stringToHex } from "viem";

describe("AcademicCredentialRegistry Smart Contract (Hardhat 3)", () => {
  async function deployFixture() {
    const conn = await hre.network.connect();
    const [admin, ufs, itb, hacker] = await conn.viem.getWalletClients();
    const publicClient = await conn.viem.getPublicClient();

    const registry = await conn.viem.deployContract("AcademicCredentialRegistry");

    return { registry, admin, ufs, itb, hacker, publicClient, conn };
  }

  it("1. Administrador consegue autorizar emissor (UFS e ITB)", async () => {
    const { registry, admin, ufs } = await deployFixture();

    await registry.write.authorizeIssuer([ufs.account.address, "Universidade Federal do Saber (UFS)"], {
      account: admin.account,
    });

    const isAuth = await registry.read.isIssuerAuthorized([ufs.account.address]);
    assert.equal(isAuth, true);
  });

  it("2. Conta não autorizada não consegue emitir credencial", async () => {
    const { registry, hacker } = await deployFixture();
    const credId = keccak256(toHex("doc-001"));
    const hash = keccak256(toHex("conteudo-canonico"));

    await assert.rejects(
      async () => {
        await registry.write.issueCredential([credId, hash], {
          account: hacker.account,
        });
      },
      /OnlyAuthorizedIssuerAllowed/
    );
  });

  it("3. Emissor autorizado consegue emitir credencial", async () => {
    const { registry, admin, ufs } = await deployFixture();
    await registry.write.authorizeIssuer([ufs.account.address, "UFS"], { account: admin.account });

    const credId = keccak256(toHex("doc-002"));
    const hash = keccak256(toHex("conteudo-canonico-002"));

    await registry.write.issueCredential([credId, hash], { account: ufs.account });

    const cred = await registry.read.getCredential([credId]);
    assert.equal(cred[0], credId);
    assert.equal(cred[1], hash);
    assert.equal(cred[3].toLowerCase(), ufs.account.address.toLowerCase());
    assert.equal(cred[5], 1); // ISSUED
  });

  it("4. Credencial emitida pode ser consultada e verificada", async () => {
    const { registry, admin, ufs } = await deployFixture();
    await registry.write.authorizeIssuer([ufs.account.address, "UFS"], { account: admin.account });

    const credId = keccak256(toHex("doc-003"));
    const hash = keccak256(toHex("conteudo-canonico-003"));

    await registry.write.issueCredential([credId, hash], { account: ufs.account });

    const [isValid, msg] = await registry.read.verifyCredential([credId, hash]);
    assert.equal(isValid, true);
    assert.match(msg, /autentica/i);
  });

  it("5. Identificador duplicado é rejeitado com CredentialAlreadyExists", async () => {
    const { registry, admin, ufs } = await deployFixture();
    await registry.write.authorizeIssuer([ufs.account.address, "UFS"], { account: admin.account });

    const credId = keccak256(toHex("doc-duplicado"));
    const hash = keccak256(toHex("conteudo-1"));

    await registry.write.issueCredential([credId, hash], { account: ufs.account });

    await assert.rejects(
      async () => {
        await registry.write.issueCredential([credId, hash], { account: ufs.account });
      },
      /CredentialAlreadyExists/
    );
  });

  it("6. Emissor original consegue revogar sua credencial", async () => {
    const { registry, admin, ufs } = await deployFixture();
    await registry.write.authorizeIssuer([ufs.account.address, "UFS"], { account: admin.account });

    const credId = keccak256(toHex("doc-revogar"));
    const hash = keccak256(toHex("conteudo-revogar"));

    await registry.write.issueCredential([credId, hash], { account: ufs.account });
    await registry.write.revokeCredential([credId, "Matrícula cancelada formalmente"], {
      account: ufs.account,
    });

    const cred = await registry.read.getCredential([credId]);
    assert.equal(cred[5], 2); // REVOKED
    assert.equal(cred[7], "Matrícula cancelada formalmente");

    const [isValid, msg] = await registry.read.verifyCredential([credId, hash]);
    assert.equal(isValid, false);
    assert.match(msg, /REVOGADA/i);
  });

  it("7. Emissor diferente não consegue revogar credencial alheia", async () => {
    const { registry, admin, ufs, itb } = await deployFixture();
    await registry.write.authorizeIssuer([ufs.account.address, "UFS"], { account: admin.account });
    await registry.write.authorizeIssuer([itb.account.address, "ITB"], { account: admin.account });

    const credId = keccak256(toHex("doc-ufs-protegido"));
    const hash = keccak256(toHex("conteudo-ufs"));

    await registry.write.issueCredential([credId, hash], { account: ufs.account });

    await assert.rejects(
      async () => {
        await registry.write.revokeCredential([credId, "Tentativa indevida"], {
          account: itb.account,
        });
      },
      /UnauthorizedRevoker/
    );
  });

  it("8. Credencial revogada permanece revogada e não pode ser revogada novamente", async () => {
    const { registry, admin, ufs } = await deployFixture();
    await registry.write.authorizeIssuer([ufs.account.address, "UFS"], { account: admin.account });

    const credId = keccak256(toHex("doc-rev-dupla"));
    const hash = keccak256(toHex("conteudo"));

    await registry.write.issueCredential([credId, hash], { account: ufs.account });
    await registry.write.revokeCredential([credId, "Primeira revogacao"], { account: ufs.account });

    await assert.rejects(
      async () => {
        await registry.write.revokeCredential([credId, "Segunda revogacao"], { account: ufs.account });
      },
      /CredentialAlreadyRevoked/
    );
  });

  it("9. Evento CredentialIssued é emitido na emissão", async () => {
    const { registry, admin, ufs, publicClient } = await deployFixture();
    await registry.write.authorizeIssuer([ufs.account.address, "UFS"], { account: admin.account });

    const credId = keccak256(toHex("doc-evento-emissao"));
    const hash = keccak256(toHex("hash-evento"));

    const txHash = await registry.write.issueCredential([credId, hash], { account: ufs.account });
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    assert.equal(receipt.status, "success");
    assert.ok(receipt.logs.length > 0);
  });

  it("10. Evento CredentialRevoked é emitido na revogação", async () => {
    const { registry, admin, ufs, publicClient } = await deployFixture();
    await registry.write.authorizeIssuer([ufs.account.address, "UFS"], { account: admin.account });

    const credId = keccak256(toHex("doc-evento-revogacao"));
    const hash = keccak256(toHex("hash-evento-rev"));

    await registry.write.issueCredential([credId, hash], { account: ufs.account });
    const txHash = await registry.write.revokeCredential([credId, "Fraude apurada em sindicancia"], {
      account: ufs.account,
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    assert.equal(receipt.status, "success");
    assert.ok(receipt.logs.length > 0);
  });

  it("11. Conta não-administradora não consegue autorizar emissores", async () => {
    const { registry, hacker, itb } = await deployFixture();

    await assert.rejects(
      async () => {
        await registry.write.authorizeIssuer([itb.account.address, "ITB"], {
          account: hacker.account,
        });
      },
      /OnlyAdminAllowed/
    );
  });

  it("12. Detecção de adulteração: Hash diferente é rejeitado na verificação", async () => {
    const { registry, admin, ufs } = await deployFixture();
    await registry.write.authorizeIssuer([ufs.account.address, "UFS"], { account: admin.account });

    const credId = keccak256(toHex("doc-integridade"));
    const hashOriginal = keccak256(toHex("dados-reais-conclusao-2026"));
    const hashAdulterado = keccak256(toHex("dados-adulterados-nota-10"));

    await registry.write.issueCredential([credId, hashOriginal], { account: ufs.account });

    const [isValid, msg] = await registry.read.verifyCredential([credId, hashAdulterado]);
    assert.equal(isValid, false);
    assert.match(msg, /ADULTERACAO DETECTADA/i);
  });

  it("13. Etapa 3: Emissão com FileHash (PDF) e verificação de dupla camada", async () => {
    const { registry, admin, ufs } = await deployFixture();
    await registry.write.authorizeIssuer([ufs.account.address, "UFS"], { account: admin.account });

    const credId = keccak256(toHex("doc-com-pdf-01"));
    const canonicalHash = keccak256(toHex("dados-canonicos-formando"));
    const pdfBytesHash = keccak256(toHex("%PDF-1.4 bytes do diploma"));

    await registry.write.issueCredentialWithFile([credId, canonicalHash, pdfBytesHash], {
      account: ufs.account,
    });

    // 1. Verificação com ambos válidos
    const [isCredValid, isFileValid, msg] = await registry.read.verifyCredentialFull([
      credId,
      canonicalHash,
      pdfBytesHash,
    ]);
    assert.equal(isCredValid, true);
    assert.equal(isFileValid, true);
    assert.match(msg, /integro e verificado/i);

    // 2. Verificação com PDF adulterado (fileHash divergente)
    const pdfAdulteradoHash = keccak256(toHex("%PDF-1.4 bytes adulterados"));
    const [isCredValid2, isFileValid2, msg2] = await registry.read.verifyCredentialFull([
      credId,
      canonicalHash,
      pdfAdulteradoHash,
    ]);
    assert.equal(isCredValid2, true);
    assert.equal(isFileValid2, false);
    assert.match(msg2, /bytes foram modificados/i);
  });
});
