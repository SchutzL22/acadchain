import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalizeAcademicData,
  computeCanonicalSha256,
  deriveCredentialId,
  CanonicalAcademicData,
} from '../src/utils/canonicalize.js';

test('1. Canonicalização determinística: campos em ordem estável e normalizados', () => {
  const data1: CanonicalAcademicData = {
    schemaVersion: '1.0',
    documentoId: 'A1B2C3D4-E5F6-47A8-B9C0-111111111111',
    tipoDocumento: 'DIPLOMA',
    instituicaoSigla: 'ufs ',
    instituicaoCodigoMec: 'IES-901',
    estudanteCpf: '111.222.333-44',
    estudanteNome: 'Carlos Eduardo Moreira',
    cursoNome: 'Sistemas de Informação',
    numeroMatricula: 'UFS-2019-SI-045',
    dataEmissao: '2023-12-18',
  };

  const data2: CanonicalAcademicData = {
    instituicaoCodigoMec: 'IES-901',
    estudanteNome: 'Carlos Eduardo Moreira',
    schemaVersion: '1.0',
    cursoNome: 'Sistemas de Informação',
    dataEmissao: '2023-12-18',
    documentoId: 'a1b2c3d4-e5f6-47a8-b9c0-111111111111',
    estudanteCpf: '11122233344', // sem pontos
    instituicaoSigla: 'UFS',
    numeroMatricula: 'UFS-2019-SI-045',
    tipoDocumento: 'DIPLOMA',
  };

  const str1 = canonicalizeAcademicData(data1);
  const str2 = canonicalizeAcademicData(data2);

  assert.equal(str1, str2);

  const hash1 = computeCanonicalSha256(data1);
  const hash2 = computeCanonicalSha256(data2);

  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64);
});

test('2. Efeito avalanche: alteração de 1 caractere no nome gera hash totalmente distinto', () => {
  const original: CanonicalAcademicData = {
    schemaVersion: '1.0',
    documentoId: 'doc-01',
    tipoDocumento: 'DIPLOMA',
    instituicaoSigla: 'UFS',
    instituicaoCodigoMec: 'IES-901',
    estudanteCpf: '11122233344',
    estudanteNome: 'Carlos Eduardo Moreira',
    cursoNome: 'Sistemas de Informação',
    numeroMatricula: 'UFS-2019-SI-045',
    dataEmissao: '2023-12-18',
  };

  const adulterado: CanonicalAcademicData = {
    ...original,
    estudanteNome: 'Carlos Eduardo MoreirA', // 1 letra maiúscula alterada
  };

  const hashOrig = computeCanonicalSha256(original);
  const hashAdul = computeCanonicalSha256(adulterado);

  assert.notEqual(hashOrig, hashAdul);
});

test('3. Derivação de Credential ID a partir de UUID', () => {
  const uuid = 'a1b2c3d4-e5f6-47a8-b9c0-111111111111';
  const credId = deriveCredentialId(uuid);

  assert.ok(credId.startsWith('0x'));
  assert.equal(credId.length, 66); // 32 bytes em hex com 0x
});
