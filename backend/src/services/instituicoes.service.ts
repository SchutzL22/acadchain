import { getDatabase } from '../config/database.js';
import { Instituicao } from '../types/instituicao.js';

export class InstituicoesService {
  public static listarTodas(): Instituicao[] {
    const db = getDatabase();
    const query = `
      SELECT 
        i.id,
        i.codigo_mec_ficticio,
        i.nome,
        i.sigla,
        i.cnpj_ficticio,
        i.cidade,
        i.estado,
        i.tipo,
        i.status,
        i.endereco_blockchain_planejado,
        i.criado_em,
        COUNT(DISTINCT m.id) AS total_matriculas,
        COUNT(DISTINCT d.id) AS total_documentos
      FROM instituicoes i
      LEFT JOIN matriculas m ON m.instituicao_id = i.id
      LEFT JOIN documentos d ON d.matricula_id = m.id
      GROUP BY i.id
      ORDER BY i.nome ASC
    `;
    const rows = db.prepare(query).all() as unknown as Instituicao[];
    return rows;
  }

  public static buscarPorId(id: number): Instituicao | null {
    const db = getDatabase();
    const query = `
      SELECT 
        i.id,
        i.codigo_mec_ficticio,
        i.nome,
        i.sigla,
        i.cnpj_ficticio,
        i.cidade,
        i.estado,
        i.tipo,
        i.status,
        i.endereco_blockchain_planejado,
        i.criado_em
      FROM instituicoes i
      WHERE i.id = ?
    `;
    const row = db.prepare(query).get(id) as unknown as Instituicao | undefined;
    return row || null;
  }
}
