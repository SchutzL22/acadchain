import { Request, Response, NextFunction } from 'express';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import QRCode from 'qrcode';
import { getDatabase } from '../config/database.js';
import { PdfService } from '../services/pdf.service.js';
import { BlockchainService } from '../services/blockchain.service.js';
import { deriveCredentialId, computeCanonicalSha256, CanonicalAcademicData } from '../utils/canonicalize.js';

export class DocumentosController {
  /**
   * Retorna ou faz download do arquivo PDF do documento.
   */
  public static async obterPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrUuid = String(req.params.id);
      const isDownload = req.query.download === 'true';

      const pdfResult = await PdfService.getOrGeneratePdfForDocumento(idOrUuid);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `${isDownload ? 'attachment' : 'inline'}; filename="${pdfResult.filePath.split(/[\\/]/).pop()}"`
      );
      res.setHeader('X-AcadChain-SHA256', pdfResult.fileHashSha256);

      res.status(200).send(pdfResult.pdfBuffer);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Retorna os dados completos para renderização da Carteirinha Estudantil Digital.
   */
  public static async obterDadosCarteirinha(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrUuid = String(req.params.id);
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
          m.id AS matricula_id,
          m.curso,
          m.nivel,
          m.numero_matricula,
          m.status AS matricula_status,
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
        WHERE (d.uuid_publico = ? OR d.id = ?) AND d.tipo = 'CARTEIRINHA'
      `;

      const doc = db.prepare(query).get(idOrUuid, idOrUuid) as any;
      if (!doc) {
        res.status(404).json({
          sucesso: false,
          erro: `Carteirinha estudantil '${idOrUuid}' não encontrada.`,
        });
        return;
      }

      // Consulta status na blockchain
      let estadoBlockchain = null;
      try {
        const credId = deriveCredentialId(doc.uuid_publico);
        estadoBlockchain = await BlockchainService.getCredentialFromContract(credId);
      } catch {
        estadoBlockchain = { disponivel: false };
      }

      const verifyUrl = `http://localhost:5173/verificar?id=${encodeURIComponent(doc.uuid_publico)}`;
      let qrCodeDataUrl = '';
      try {
        qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 140,
          color: { dark: '#0f2942', light: '#ffffff' },
        });
      } catch (qrErr) {
        // Fallback silencioso
      }

      res.status(200).json({
        sucesso: true,
        carteirinha: {
          ...doc,
          verificarUrl: verifyUrl,
          qrCodeDataUrl,
          estadoBlockchain,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Recebe um arquivo PDF via upload multipart, calcula seu hash SHA-256 e valida contra a blockchain.
   */
  public static async verificarPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;

      if (!file || !file.buffer) {
        res.status(400).json({
          sucesso: false,
          autentico: false,
          motivo: 'Nenhum arquivo PDF foi enviado no campo "arquivo".',
        });
        return;
      }

      // Validação de formato (magic bytes do PDF: %PDF- -> 0x25, 0x50, 0x44, 0x46, 0x2D)
      const isPdf =
        file.buffer.length >= 5 &&
        file.buffer[0] === 0x25 &&
        file.buffer[1] === 0x50 &&
        file.buffer[2] === 0x44 &&
        file.buffer[3] === 0x46 &&
        file.buffer[4] === 0x2d;

      if (!isPdf) {
        res.status(400).json({
          sucesso: false,
          autentico: false,
          motivo: 'O arquivo enviado não é um PDF válido (cabeçalho mágico "%PDF-" ausente).',
        });
        return;
      }

      // Calcula o hash SHA-256 exato dos bytes recebidos
      const calculatedFileHash = createHash('sha256').update(file.buffer).digest('hex');
      const calculatedFileHashHex = ("0x" + calculatedFileHash) as `0x${string}`;

      const db = getDatabase();

      // Busca no banco pelo hash do PDF físico
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
          e.cpf_ficticio AS estudante_cpf
        FROM documentos d
        JOIN matriculas m ON m.id = d.matricula_id
        JOIN instituicoes i ON i.id = m.instituicao_id
        JOIN estudantes e ON e.id = m.estudante_id
        WHERE d.hash_sha256_pdf = ?
      `;

      const doc = db.prepare(query).get(calculatedFileHash) as any;

      if (!doc) {
        res.status(200).json({
          sucesso: true,
          autentico: false,
          motivo:
            'ADULTERAÇÃO OU INEXISTÊNCIA: O hash SHA-256 do arquivo PDF não corresponde a nenhum documento emitido pelo consórcio AcadChain.',
          hashCalculado: calculatedFileHash,
          tamanhoBytes: file.buffer.length,
          nomeOriginal: file.originalname,
        });
        return;
      }

      // Reconstroi dados canônicos
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

      const canonicalHash = computeCanonicalSha256(academicData);
      const canonicalHashHex = ("0x" + canonicalHash) as `0x${string}`;
      const credId = deriveCredentialId(doc.uuid_publico);

      // Verificação de dupla camada no smart contract
      const resultadoOnChain = await BlockchainService.verifyCredentialFullOnChain(
        credId,
        canonicalHashHex,
        calculatedFileHashHex
      );

      // Checa se localmente foi revogado
      const isRevogadoLocal = doc.status === 'REVOGADO';

      const autentico = resultadoOnChain.isValid && resultadoOnChain.isFileValid && !isRevogadoLocal;

      res.status(200).json({
        sucesso: true,
        autentico,
        motivo: !autentico && isRevogadoLocal ? 'Documento foi formalmente REVOGADO pela instituição' : resultadoOnChain.motivo,
        hashArquivoSha256: calculatedFileHash,
        hashCanonicoCalculado: canonicalHash,
        hashRegistradoNoBanco: doc.hash_sha256_conteudo,
        duplaCamada: {
          metadadosCanonicosValidos: resultadoOnChain.isValid,
          arquivoFisicoValido: resultadoOnChain.isFileValid,
        },
        documento: {
          uuid: doc.uuid_publico,
          tipo: doc.tipo,
          titulo: doc.titulo,
          estudante: doc.estudante_nome,
          cpf: doc.estudante_cpf,
          curso: doc.curso,
          matricula: doc.numero_matricula,
          instituicao: doc.instituicao_nome,
          siglaInstituicao: doc.instituicao_sigla,
          dataEmissao: doc.data_emissao,
          status: doc.status,
          statusSincronizacao: doc.status_sincronizacao,
          txHash: doc.tx_hash_blockchain,
          bloco: doc.bloco_blockchain,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint de laboratório: gera uma versão corrompida (1 byte alterado) do PDF para demonstração prática.
   */
  public static async gerarPdfAdulteradoParaTeste(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrUuid = String(req.params.id);
      const pdfResult = await PdfService.getOrGeneratePdfForDocumento(idOrUuid);

      // Cria uma cópia com 1 byte adulterado (corrompe 1 byte no corpo do PDF)
      const adulteratedBuffer = Buffer.from(pdfResult.pdfBuffer);
      const targetByteIndex = Math.floor(adulteratedBuffer.length / 2);
      // Inverte os bits do byte central
      adulteratedBuffer[targetByteIndex] = adulteratedBuffer[targetByteIndex] ^ 0xff;

      const adulteratedHash = createHash('sha256').update(adulteratedBuffer).digest('hex');

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="adulterado-${idOrUuid}.pdf"`);
      res.setHeader('X-AcadChain-Original-SHA256', pdfResult.fileHashSha256);
      res.setHeader('X-AcadChain-Corrupted-SHA256', adulteratedHash);

      res.status(200).send(adulteratedBuffer);
    } catch (error) {
      next(error);
    }
  }
}
