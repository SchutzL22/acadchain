import { getDatabase } from '../config/database.js';
import { Estudante, Matricula, DocumentoResumo } from '../types/estudante.js';

export class EstudantesService {
  public static listarTodos(): Estudante[] {
    const db = getDatabase();
    
    // Busca estudantes
    const estudantesRows = db.prepare(`
      SELECT id, cpf_ficticio, nome_completo, email, data_nascimento, criado_em
      FROM estudantes
      ORDER BY nome_completo ASC
    `).all() as unknown as Estudante[];

    // Busca matriculas com dados das instituicoes
    const matriculasRows = db.prepare(`
      SELECT 
        m.id,
        m.estudante_id,
        m.instituicao_id,
        i.sigla AS instituicao_sigla,
        i.nome AS instituicao_nome,
        m.numero_matricula,
        m.curso,
        m.nivel,
        m.ano_ingresso,
        m.status
      FROM matriculas m
      JOIN instituicoes i ON i.id = m.instituicao_id
    `).all() as unknown as (Matricula & { estudante_id: number })[];

    // Busca documentos
    const docsRows = db.prepare(`
      SELECT 
        d.id,
        m.estudante_id,
        d.uuid_publico,
        d.tipo,
        d.titulo,
        d.data_emissao,
        d.hash_sha256_conteudo,
        d.status
      FROM documentos d
      JOIN matriculas m ON m.id = d.matricula_id
    `).all() as unknown as (DocumentoResumo & { estudante_id: number })[];

    // Mapeia e junta de forma limpa em memória
    return estudantesRows.map((est) => {
      const matriculas = matriculasRows
        .filter((m) => m.estudante_id === est.id)
        .map(({ estudante_id, ...resto }) => resto);

      const documentos = docsRows
        .filter((d) => d.estudante_id === est.id)
        .map(({ estudante_id, ...resto }) => resto);

      return {
        ...est,
        matriculas,
        documentos,
      };
    });
  }

  public static buscarPorId(id: number): Estudante | null {
    const db = getDatabase();
    const est = db.prepare(`
      SELECT id, cpf_ficticio, nome_completo, email, data_nascimento, criado_em
      FROM estudantes
      WHERE id = ?
    `).get(id) as unknown as Estudante | undefined;

    if (!est) return null;

    const matriculas = db.prepare(`
      SELECT 
        m.id,
        m.instituicao_id,
        i.sigla AS instituicao_sigla,
        i.nome AS instituicao_nome,
        m.numero_matricula,
        m.curso,
        m.nivel,
        m.ano_ingresso,
        m.status
      FROM matriculas m
      JOIN instituicoes i ON i.id = m.instituicao_id
      WHERE m.estudante_id = ?
    `).all(id) as unknown as Matricula[];

    const documentos = db.prepare(`
      SELECT 
        d.id,
        d.uuid_publico,
        d.tipo,
        d.titulo,
        d.data_emissao,
        d.hash_sha256_conteudo,
        d.status
      FROM documentos d
      JOIN matriculas m ON m.id = d.matricula_id
      WHERE m.estudante_id = ?
    `).all(id) as unknown as DocumentoResumo[];

    return {
      ...est,
      matriculas,
      documentos,
    };
  }
}
