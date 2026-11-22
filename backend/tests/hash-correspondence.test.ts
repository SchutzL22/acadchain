import test from 'node:test';
import assert from 'node:assert/strict';
import { getDatabase } from '../src/config/database.js';
import {
  computeCanonicalSha256,
  CanonicalAcademicData,
} from '../src/utils/canonicalize.js';

test('Garantir que os dados demonstrativos do SQLite correspondem 100% aos hashes canônicos', () => {
  const db = getDatabase();

  const query = `
    SELECT 
      d.id,
      d.uuid_publico,
      d.tipo,
      d.data_emissao,
      d.hash_sha256_conteudo,
      m.curso,
      m.numero_matricula,
      i.sigla AS instituicao_sigla,
      i.codigo_mec_ficticio,
      e.nome_completo AS estudante_nome,
      e.cpf_ficticio AS estudante_cpf
    FROM documentos d
    JOIN matriculas m ON m.id = d.matricula_id
    JOIN instituicoes i ON i.id = m.instituicao_id
    JOIN estudantes e ON e.id = m.estudante_id
    WHERE d.id IN (1, 2, 3, 4)
    ORDER BY d.id ASC
  `;

  const rows = db.prepare(query).all() as any[];
  assert.equal(rows.length, 4, 'Devem existir 4 documentos demonstrativos no SQLite.');

  for (const row of rows) {
    const data: CanonicalAcademicData = {
      schemaVersion: '1.0',
      documentoId: row.uuid_publico,
      tipoDocumento: row.tipo,
      instituicaoSigla: row.instituicao_sigla,
      instituicaoCodigoMec: row.codigo_mec_ficticio,
      estudanteCpf: row.estudante_cpf,
      estudanteNome: row.estudante_nome,
      cursoNome: row.curso,
      numeroMatricula: row.numero_matricula,
      dataEmissao: row.data_emissao,
    };

    const calculatedHash = computeCanonicalSha256(data);

    assert.equal(
      row.hash_sha256_conteudo,
      calculatedHash,
      `O hash do documento ${row.id} (${row.uuid_publico}) no SQLite deve ser estritamente igual ao hash canônico recalculado.`
    );
  }
});
