import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { Server } from 'node:http';

let server: Server;
let baseUrl: string;

test.before(async () => {
  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address();
      if (address && typeof address === 'object') {
        baseUrl = `http://localhost:${address.port}`;
      }
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

test('1. GET /api/blockchain/status deve retornar nó online e contrato implantado', async () => {
  const res = await fetch(`${baseUrl}/api/blockchain/status`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.sucesso, true);
  assert.equal(data.dados.online, true);
  assert.equal(data.dados.chainId, 31337);
  assert.equal(data.dados.contratoImplantado, true);
  assert.ok(data.dados.contrato.endereco.startsWith('0x'));
  assert.ok(data.dados.contrato.totalEmitidas >= 4);
});

test('2. GET /api/blockchain/contrato deve retornar manifesto com ABI e emissores', async () => {
  const res = await fetch(`${baseUrl}/api/blockchain/contrato`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.sucesso, true);
  assert.equal(data.dados.chainId, 31337);
  assert.ok(Array.isArray(data.dados.issuers));
  assert.equal(data.dados.issuers.length, 3);
});

test('3. POST /api/credenciais/emitir deve registrar credencial na blockchain com transação real', async () => {
  const res = await fetch(`${baseUrl}/api/credenciais/emitir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      matriculaId: 1,
      tipo: 'DIPLOMA',
      titulo: 'Diploma de Engenharia de Software Teste',
      dataEmissao: '2026-11-22',
      instituicaoId: 1, // UFS
    }),
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.sucesso, true);
  assert.ok(data.dados.txHash.startsWith('0x'));
  assert.ok(data.dados.bloco >= 1);

  // Verifica que a nova credencial é validada com sucesso contra o Smart Contract
  const verifRes = await fetch(`${baseUrl}/api/credenciais/${data.dados.uuid}/verificar`);
  const verifData = await verifRes.json();
  assert.equal(verifData.valido, true);
  assert.match(verifData.motivo, /autentica/i);
});

test('4. Detecção de adulteração: Consulta com hash adulterado deve ser rejeitada', async () => {
  const emitRes = await fetch(`${baseUrl}/api/credenciais/emitir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      matriculaId: 2,
      tipo: 'CERTIFICADO',
      titulo: 'Certificado Integridade Teste',
      dataEmissao: '2026-11-22',
      instituicaoId: 1, // UFS
    }),
  });
  const emitData = await emitRes.json();
  const uuid = emitData.dados.uuid;

  // Envia hash adulterado
  const hashAdulterado = '0x1111111111111111111111111111111111111111111111111111111111111111';
  const verifRes = await fetch(`${baseUrl}/api/credenciais/${uuid}/verificar?claimedHash=${hashAdulterado}`);
  const verifData = await verifRes.json();
  assert.equal(verifData.valido, false);
  assert.match(verifData.motivo, /ADULTERACAO DETECTADA/i);
});

test('5. POST /api/credenciais/:id/revogar deve revogar formalmente no smart contract', async () => {
  // Emite credencial pelo ITB (instituicaoId: 2)
  const emitRes = await fetch(`${baseUrl}/api/credenciais/emitir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      matriculaId: 3,
      tipo: 'CERTIFICADO',
      titulo: 'Certificado para Revogação ITB',
      dataEmissao: '2026-11-22',
      instituicaoId: 2, // ITB
    }),
  });
  const emitData = await emitRes.json();
  assert.equal(emitRes.status, 201);
  const uuid = emitData.dados.uuid;

  // Revoga pelo ITB
  const revRes = await fetch(`${baseUrl}/api/credenciais/${uuid}/revogar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      motivo: 'Cancelamento por determinação de sindicância',
      instituicaoId: 2,
    }),
  });
  assert.equal(revRes.status, 200);
  const revData = await revRes.json();
  assert.equal(revData.sucesso, true);

  // Consulta novamente para atestar que o Smart Contract agora rejeita como REVOGADO
  const verifRes = await fetch(`${baseUrl}/api/credenciais/${uuid}/verificar`);
  const verifData = await verifRes.json();
  assert.equal(verifData.valido, false);
  assert.match(verifData.motivo, /REVOGADA/i);
});
