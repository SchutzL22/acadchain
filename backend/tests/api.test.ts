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
