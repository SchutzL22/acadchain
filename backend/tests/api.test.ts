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

test('GET /api/health deve retornar status 200 e informações do banco', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.sucesso, true);
  assert.equal(data.banco.tipo, 'SQLite (node:sqlite)');
  assert.equal(data.banco.status, 'conectado');
});

test('GET /api/instituicoes deve retornar lista de instituições fictícias', async () => {
  const res = await fetch(`${baseUrl}/api/instituicoes`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.sucesso, true);
  assert.ok(Array.isArray(data.dados));
  assert.ok(data.dados.length >= 3);
  
  const siglas = data.dados.map((i: any) => i.sigla);
  assert.ok(siglas.includes('UFS'));
  assert.ok(siglas.includes('ITB'));
  assert.ok(siglas.includes('PUI'));
});

test('GET /api/estudantes deve retornar lista de estudantes com matrículas', async () => {
  const res = await fetch(`${baseUrl}/api/estudantes`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.sucesso, true);
  assert.ok(Array.isArray(data.dados));
  assert.ok(data.dados.length >= 5);
  
  const primeiro = data.dados[0];
  assert.ok(primeiro.nome_completo);
  assert.ok(Array.isArray(primeiro.matriculas));
});

test('GET /api/instituicoes/1 deve retornar detalhes da UFS', async () => {
  const res = await fetch(`${baseUrl}/api/instituicoes/1`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.sucesso, true);
  assert.equal(data.dados.sigla, 'UFS');
});

test('GET /api/instituicoes/9999 deve retornar 404', async () => {
  const res = await fetch(`${baseUrl}/api/instituicoes/9999`);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.equal(data.sucesso, false);
});

test('GET /api/documentos/1/pdf deve retornar streaming de PDF válido e header de hash', async () => {
  const res = await fetch(`${baseUrl}/api/documentos/1/pdf`);
  assert.equal(res.status, 200);
  assert.ok(res.headers.get('content-type')?.includes('application/pdf'));
  assert.ok(res.headers.get('x-acadchain-sha256'));

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  assert.ok(buffer.length > 500);
  assert.equal(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
});

test('GET /api/documentos/2/carteirinha deve retornar dados formatados da carteirinha estudantil', async () => {
  const res = await fetch(`${baseUrl}/api/documentos/2/carteirinha`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.sucesso, true);
  assert.equal(data.carteirinha.tipo, 'CARTEIRINHA');
  assert.ok(data.carteirinha.estudante_nome);
  assert.ok(data.carteirinha.numero_matricula);
  assert.ok(data.carteirinha.qrCodeDataUrl.startsWith('data:image/png;base64,'));
});
