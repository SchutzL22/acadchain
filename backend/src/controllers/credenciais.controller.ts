import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../config/database.js';
import { BlockchainService } from '../services/blockchain.service.js';
import { PdfService } from '../services/pdf.service.js';
import {
  canonicalizeAcademicData,
  computeCanonicalSha256,
  deriveCredentialId,
  CanonicalAcademicData,
} from '../utils/canonicalize.js';

export class CredenciaisController {
  /**
   * Lista todas as credenciais registradas no banco local.
   */
  public static listar(req: Request, res: Response, next: NextFunction): void {
    try {
      const db = getDatabase();
      const query = `
        SELECT 
          d.id,
          d.uuid_publico,
          d.tipo,
          d.titulo,
          d.descricao,
          d.data_emissao,
          d.data_validade,
          d.hash_sha256_conteudo,
          d.hash_sha256_pdf,
          d.caminho_arquivo_pdf,
          d.status,
          d.tx_hash_blockchain,
          d.bloco_blockchain,
          d.smart_contract_address,
          d.endereco_emissor_blockchain,
          d.status_sincronizacao,
          d.revogado_em,
          d.motivo_revogacao,
          m.curso,
          m.nivel,
          m.numero_matricula,
          i.id AS instituicao_id,
          i.sigla AS instituicao_sigla,
          i.nome AS instituicao_nome,
          e.id AS estudante_id,
          e.nome_completo AS estudante_nome,
          e.cpf_ficticio AS estudante_cpf
        FROM documentos d
        JOIN matriculas m ON m.id = d.matricula_id
        JOIN instituicoes i ON i.id = m.instituicao_id
        JOIN estudantes e ON e.id = m.estudante_id
        ORDER BY d.id DESC
      `;
      const docs = db.prepare(query).all();

      res.status(200).json({
        sucesso: true,
        total: docs.length,
        dados: docs,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca detalhes completos de uma credencial pelo UUID ou ID.
   */
  public static async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrUuid = String(req.params.id);
      const db = getDatabase();

      const query = `
        SELECT 
          d.*,
          m.curso,
          m.nivel,
          m.numero_matricula,
          i.id AS instituicao_id,
          i.sigla AS instituicao_sigla,
          i.nome AS instituicao_nome,
          i.codigo_mec_ficticio,
          e.id AS estudante_id,
          e.nome_completo AS estudante_nome,
          e.cpf_ficticio AS estudante_cpf,
          e.email AS estudante_email
        FROM documentos d
        JOIN matriculas m ON m.id = d.matricula_id
        JOIN instituicoes i ON i.id = m.instituicao_id
        JOIN estudantes e ON e.id = m.estudante_id
        WHERE d.uuid_publico = ? OR d.id = ?
      `;

      const doc = db.prepare(query).get(idOrUuid, idOrUuid) as any;

      if (!doc) {
        res.status(404).json({
          sucesso: false,
          erro: `Credencial '${idOrUuid}' não encontrada no banco de dados.`,
        });
        return;
      }

      // Consulta estado on-chain em tempo real se a blockchain estiver online
      let estadoOnChain = null;
      try {
        const credId = deriveCredentialId(doc.uuid_publico);
        estadoOnChain = await BlockchainService.getCredentialFromContract(credId);
      } catch (err: any) {
        estadoOnChain = { disponivel: false, motivo: err.message };
      }

      res.status(200).json({
        sucesso: true,
        dados: {
          ...doc,
          estadoOnChain,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Executa a verificação completa de uma credencial contra o Smart Contract.
   */
  public static async verificar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrUuid = String(req.params.id);
      const claimedHash = req.query.claimedHash ? String(req.query.claimedHash) : undefined;
      const db = getDatabase();

      const query = `
        SELECT 
          d.*,
          m.curso,
          m.numero_matricula,
          i.id AS instituicao_id,
          i.sigla AS instituicao_sigla,
          i.codigo_mec_ficticio,
          i.nome AS instituicao_nome,
          e.nome_completo AS estudante_nome,
          e.cpf_ficticio AS estudante_cpf
        FROM documentos d
        JOIN matriculas m ON m.id = d.matricula_id
        JOIN instituicoes i ON i.id = m.instituicao_id
        JOIN estudantes e ON e.id = m.estudante_id
        WHERE d.uuid_publico = ? OR d.id = ?
      `;
      const doc = db.prepare(query).get(idOrUuid, idOrUuid) as any;

      if (!doc) {
        res.status(404).json({
          sucesso: false,
          valido: false,
          motivo: 'Credencial não localizada na base cadastral da aplicação.',
        });
        return;
      }

      // Constrói os dados canônicos
      const academicData: CanonicalAcademicData = {
        schemaVersion: '1.0',
        documentoId: doc.uuid_publico,
        tipoDocumento: doc.tipo,
        instituicaoSigla: doc.instituicao_sigla,
        instituicaoCodigoMec: doc.codigo_mec_ficticio,
        estudanteCpf: doc.estudante_cpf,
        estudanteNome: doc.estudante_nome,
        cursoNome: doc.curso,
        numeroMatricula: doc.numero_matricula,
        dataEmissao: doc.data_emissao,
      };

      const calculatedHash = computeCanonicalSha256(academicData);
      const hashParaValidar = claimedHash || calculatedHash;
      const credId = deriveCredentialId(doc.uuid_publico);

      const hashHex = ("0x" + hashParaValidar.replace(/^0x/, '')) as `0x${string}`;

      // Validação on-chain real no Smart Contract
      const resultadoOnChain = await BlockchainService.verifyCredentialOnChain(credId, hashHex);

      res.status(200).json({
        sucesso: true,
        valido: resultadoOnChain.isValid,
        motivo: resultadoOnChain.motivo,
        comparativo: {
          hashCalculado: calculatedHash,
          hashReivindicado: hashParaValidar,
          hashRegistradoNoBanco: doc.hash_sha256_conteudo,
          coincidem: calculatedHash === hashParaValidar,
        },
        documento: {
          uuid: doc.uuid_publico,
          tipo: doc.tipo,
          titulo: doc.titulo,
          estudante: doc.estudante_nome,
          instituicao: doc.instituicao_nome,
          statusLocal: doc.status,
          statusSincronizacao: doc.status_sincronizacao,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Emite uma nova credencial acadêmica, computa hash canônico e grava on-chain.
   */
  public static async emitir(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        matriculaId,
        tipo,
        titulo,
        descricao,
        dataEmissao,
        instituicaoId,
      } = req.body;

      if (!matriculaId || !tipo || !titulo || !dataEmissao) {
        res.status(400).json({
          sucesso: false,
          erro: 'Campos obrigatórios: matriculaId, tipo, titulo, dataEmissao.',
        });
        return;
      }

      const db = getDatabase();
      const matricula = db.prepare(`
        SELECT 
          m.*,
          i.id AS instituicao_id,
          i.sigla AS instituicao_sigla,
          i.codigo_mec_ficticio,
          e.nome_completo AS estudante_nome,
          e.cpf_ficticio AS estudante_cpf
        FROM matriculas m
        JOIN instituicoes i ON i.id = m.instituicao_id
        JOIN estudantes e ON e.id = m.estudante_id
        WHERE m.id = ?
      `).get(matriculaId) as any;

      if (!matricula) {
        res.status(404).json({
          sucesso: false,
          erro: 'Matrícula não encontrada.',
        });
        return;
      }

      // Gera novo UUID v4
      const crypto = await import('node:crypto');
      const uuid = crypto.randomUUID();

      const academicData: CanonicalAcademicData = {
        schemaVersion: '1.0',
        documentoId: uuid,
        tipoDocumento: tipo,
        instituicaoSigla: matricula.instituicao_sigla,
        instituicaoCodigoMec: matricula.codigo_mec_ficticio,
        estudanteCpf: matricula.estudante_cpf,
        estudanteNome: matricula.estudante_nome,
        cursoNome: matricula.curso,
        numeroMatricula: matricula.numero_matricula,
        dataEmissao,
      };

      const canonicalString = canonicalizeAcademicData(academicData);
      const canonicalHash = computeCanonicalSha256(academicData);
      const canonicalHashHex = ("0x" + canonicalHash) as `0x${string}`;

      // 1. Gera imediatamente o PDF e computa o hash dos seus bytes
      const pdfParams = {
        uuid,
        tipo: tipo as 'DIPLOMA' | 'CERTIFICADO' | 'CARTEIRINHA',
        titulo,
        descricao,
        dataEmissao,
        estudante: {
          nome: matricula.estudante_nome,
          cpf: matricula.estudante_cpf,
          email: matricula.estudante_email,
        },
        matricula: {
          numero: matricula.numero_matricula,
          curso: matricula.curso,
          nivel: matricula.nivel,
        },
        instituicao: {
          sigla: matricula.instituicao_sigla,
          nome: matricula.instituicao_nome,
          codigoMec: matricula.codigo_mec_ficticio,
        },
      };

      let pdfResult;
      if (tipo === 'CARTEIRINHA') {
        pdfResult = await PdfService.generateStudentCardPdf(pdfParams);
      } else {
        pdfResult = await PdfService.generateDiplomaOrCertificadoPdf(pdfParams);
      }

      const fileHashHex = ("0x" + pdfResult.fileHashSha256) as `0x${string}`;

      // 2. Salva no banco local com ambos os hashes (canônico + PDF físico)
      const insert = db.prepare(`
        INSERT INTO documentos (
          uuid_publico, matricula_id, tipo, titulo, descricao,
          data_emissao, hash_sha256_conteudo, hash_sha256_pdf, caminho_arquivo_pdf,
          status, status_sincronizacao, dados_canonicos_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'EMITIDO', 'PENDENTE', ?)
      `);

      insert.run(
        uuid,
        matriculaId,
        tipo,
        titulo,
        descricao || null,
        dataEmissao,
        canonicalHash,
        pdfResult.fileHashSha256,
        pdfResult.relativeFilePath,
        canonicalString
      );

      // 3. Grava na blockchain com dupla prova (canônica + bytes do PDF)
      const instId = instituicaoId || matricula.instituicao_id;
      const txResult = await BlockchainService.issueCredentialOnChain(
        uuid,
        canonicalHashHex,
        instId,
        fileHashHex
      );

      res.status(201).json({
        sucesso: true,
        mensagem: 'Credencial emitida e confirmada com sucesso na blockchain!',
        dados: {
          uuid,
          hashSha256Canonica: canonicalHash,
          hashSha256Pdf: pdfResult.fileHashSha256,
          caminhoPdf: pdfResult.relativeFilePath,
          txHash: txResult.txHash,
          bloco: txResult.bloco,
          emissor: txResult.emissor,
          gasUsado: txResult.gasUsado,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Revoga formalmente uma credencial com transação real na blockchain.
   */
  public static async revogar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrUuid = String(req.params.id);
      const { motivo, instituicaoId } = req.body;

      if (!motivo) {
        res.status(400).json({
          sucesso: false,
          erro: 'O motivo da revogação é obrigatório.',
        });
        return;
      }

      const db = getDatabase();
      const doc = db.prepare(`
        SELECT d.*, m.instituicao_id
        FROM documentos d
        JOIN matriculas m ON m.id = d.matricula_id
        WHERE d.uuid_publico = ? OR d.id = ?
      `).get(idOrUuid, idOrUuid) as any;

      if (!doc) {
        res.status(404).json({
          sucesso: false,
          erro: 'Credencial não encontrada.',
        });
        return;
      }

      if (doc.status === 'REVOGADO') {
        res.status(400).json({
          sucesso: false,
          erro: 'Esta credencial já se encontra revogada.',
        });
        return;
      }

      const instId = instituicaoId || doc.instituicao_id;

      // Executa revogação na blockchain
      const txResult = await BlockchainService.revokeCredentialOnChain(
        doc.uuid_publico,
        motivo,
        instId
      );

      res.status(200).json({
        sucesso: true,
        mensagem: 'Credencial formalmente revogada na blockchain.',
        dados: {
          uuid: doc.uuid_publico,
          txHash: txResult.txHash,
          bloco: txResult.bloco,
          motivo,
          revogadoPor: txResult.revogadoPor,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }
}
