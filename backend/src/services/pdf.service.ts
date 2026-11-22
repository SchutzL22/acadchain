import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { getDatabase } from '../config/database.js';

export interface DocumentoPdfParams {
  id?: number;
  uuid: string;
  tipo: 'DIPLOMA' | 'CERTIFICADO' | 'CARTEIRINHA';
  titulo: string;
  descricao?: string;
  dataEmissao: string;
  dataValidade?: string;
  estudante: {
    nome: string;
    cpf: string;
    email?: string;
  };
  matricula: {
    numero: string;
    curso: string;
    nivel?: string;
  };
  instituicao: {
    sigla: string;
    nome: string;
    codigoMec?: string;
  };
  publicVerifyUrl?: string;
}

export interface GeneratedPdfResult {
  filePath: string;
  relativeFilePath: string;
  pdfBuffer: Buffer;
  fileHashSha256: string;
}

export class PdfService {
  private static getDocumentsDir(): string {
    const isInsideBackend = process.cwd().replace(/\\/g, '/').endsWith('/backend');
    const projectRoot = isInsideBackend ? path.resolve(process.cwd(), '..') : process.cwd();
    const docsDir = path.resolve(projectRoot, 'dados', 'documentos');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    return docsDir;
  }

  /**
   * Gera documento PDF acadêmico (Diploma ou Certificado em formato A4 Paisagem).
   */
  public static async generateDiplomaOrCertificadoPdf(
    params: DocumentoPdfParams
  ): Promise<GeneratedPdfResult> {
    const docsDir = this.getDocumentsDir();
    const fileName = `${params.tipo.toLowerCase()}-${params.uuid}.pdf`;
    const filePath = path.resolve(docsDir, fileName);
    const relativeFilePath = `dados/documentos/${fileName}`;

    const verifyUrl =
      params.publicVerifyUrl ||
      `http://localhost:5173/verificar?id=${encodeURIComponent(params.uuid)}`;

    // Gera QR Code como Data URL (PNG)
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 140,
      color: {
        dark: '#0f2942',
        light: '#ffffff',
      },
    });
    const qrBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 40,
        info: {
          Title: `${params.titulo} - ${params.estudante.nome}`,
          Author: params.instituicao.nome,
          Subject: 'Certificação Acadêmica AcadChain',
          Keywords: 'acadchain, blockchain, diploma, rfc8785, sha256',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('error', (err) => reject(err));

      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        const fileHashSha256 = createHash('sha256').update(pdfBuffer).digest('hex');

        fs.writeFileSync(filePath, pdfBuffer);

        // Atualiza banco de dados com hash e caminho físico se id existir
        try {
          const db = getDatabase();
          db.prepare(`
            UPDATE documentos 
            SET hash_sha256_pdf = ?, caminho_arquivo_pdf = ?
            WHERE uuid_publico = ?
          `).run(fileHashSha256, relativeFilePath, params.uuid);
        } catch (dbErr: any) {
          console.warn('[PdfService] Aviso ao persistir hash do PDF no banco:', dbErr.message);
        }

        resolve({
          filePath,
          relativeFilePath,
          pdfBuffer,
          fileHashSha256,
        });
      });

      // --- Desenho Gráfico do Certificado ---
      const width = doc.page.width;
      const height = doc.page.height;

      // Moldura Externa (Navy AcadChain)
      doc.rect(20, 20, width - 40, height - 40)
        .lineWidth(4)
        .strokeColor('#0f2942')
        .stroke();

      // Moldura Interna Delicada (Verde Esmeralda AcadChain)
      doc.rect(26, 26, width - 52, height - 52)
        .lineWidth(1.5)
        .strokeColor('#10b981')
        .stroke();

      // Linha decorativa no cabeçalho
      doc.rect(32, 32, width - 64, 4)
        .fillColor('#0f2942')
        .fill();

      // Cabeçalho Institucional
      doc.fillColor('#0f2942')
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(params.instituicao.nome.toUpperCase(), 40, 50, { align: 'center' });

      doc.fillColor('#64748b')
        .fontSize(10)
        .font('Helvetica')
        .text(
          `Credenciamento Fictício MEC: ${params.instituicao.codigoMec || 'IES-MEC'} | Rede AcadChain Consórcio`,
          40,
          72,
          { align: 'center' }
        );

      // Título do Documento
      doc.moveDown(1.5);
      doc.fillColor('#0f2942')
        .fontSize(26)
        .font('Helvetica-Bold')
        .text(params.tipo === 'DIPLOMA' ? 'DIPLOMA DE GRADUAÇÃO' : 'CERTIFICADO DE CONCLUSÃO', {
          align: 'center',
        });

      // Texto Principal
      doc.moveDown(1.5);
      doc.fillColor('#1e293b')
        .fontSize(13)
        .font('Helvetica')
        .lineGap(6)
        .text(
          `Certificamos, para os devidos fins de direito acadêmico e pesquisa científica, que o(a) discente `,
          70,
          180,
          { continued: true, align: 'justify', width: width - 140 }
        )
        .font('Helvetica-Bold')
        .text(`${params.estudante.nome}, `, { continued: true })
        .font('Helvetica')
        .text(
          `inscrito(a) no CPF sob o nº ${params.estudante.cpf}, concluiu com pleno êxito e aprovação o curso de `,
          { continued: true }
        )
        .font('Helvetica-Bold')
        .text(`${params.matricula.curso} `, { continued: true })
        .font('Helvetica')
        .text(
          `(${params.matricula.nivel || 'Ensino Superior'}), sob o registro de matrícula nº `,
          { continued: true }
        )
        .font('Helvetica-Bold')
        .text(`${params.matricula.numero}, `, { continued: true })
        .font('Helvetica')
        .text(
          `cumprindo integralmente a carga horária e todos os requisitos curriculares previstos no projeto pedagógico da instituição.`,
          { continued: false }
        );

      // Metadados Acadêmicos e Bloco Criptográfico
      const metaY = 320;
      doc.rect(70, metaY, width - 260, 95)
        .fillColor('#f8fafc')
        .fillAndStroke('#e2e8f0');

      doc.fillColor('#0f2942')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('METADADOS DE VERIFICAÇÃO CRIPTOGRÁFICA', 85, metaY + 10);

      doc.fillColor('#475569')
        .fontSize(8)
        .font('Helvetica')
        .text(`Identificador Único (UUID): ${params.uuid}`, 85, metaY + 28)
        .text(`Data Formal de Emissão: ${params.dataEmissao}`, 85, metaY + 42)
        .text(`Instituição Emissora: ${params.instituicao.nome} (${params.instituicao.sigla})`, 85, metaY + 56)
        .text(`Protocolo de Integridade: SHA-256 Canônico (RFC 8785) + Smart Contract Ethereum`, 85, metaY + 70);

      // Posicionamento do QR Code
      doc.image(qrBuffer, width - 180, metaY - 5, { width: 105, height: 105 });
      doc.fillColor('#64748b')
        .fontSize(7)
        .font('Helvetica')
        .text('Aponte para verificar integridade', width - 185, metaY + 105, {
          width: 115,
          align: 'center',
        });

      // Assinaturas Institucionais
      const sigY = 460;
      doc.moveTo(110, sigY).lineTo(310, sigY).lineWidth(0.8).strokeColor('#94a3b8').stroke();
      doc.moveTo(width - 310, sigY).lineTo(width - 110, sigY).lineWidth(0.8).strokeColor('#94a3b8').stroke();

      doc.fillColor('#334155')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Prof. Dr. Reitor / Direção Geral', 110, sigY + 6, { width: 200, align: 'center' })
        .text('Coordenação de Registro Acadêmico', width - 310, sigY + 6, { width: 200, align: 'center' });

      // Disclaimer Científico Obrigatório
      doc.fillColor('#94a3b8')
        .fontSize(7.5)
        .font('Helvetica-Oblique')
        .text(
          'Aviso Legal Científico: Documento emitido para fins de pesquisa acadêmica pelo protótipo AcadChain. Não possui validade jurídica governamental ou homologação direta do MEC/ICP-Brasil.',
          40,
          height - 35,
          { align: 'center', width: width - 80 }
        );

      doc.end();
    });
  }

  /**
   * Gera documento PDF da Carteirinha Estudantil Digital.
   */
  public static async generateStudentCardPdf(
    params: DocumentoPdfParams
  ): Promise<GeneratedPdfResult> {
    const docsDir = this.getDocumentsDir();
    const fileName = `carteirinha-${params.uuid}.pdf`;
    const filePath = path.resolve(docsDir, fileName);
    const relativeFilePath = `dados/documentos/${fileName}`;

    const verifyUrl =
      params.publicVerifyUrl ||
      `http://localhost:5173/verificar?id=${encodeURIComponent(params.uuid)}`;

    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 130,
      color: {
        dark: '#0f2942',
        light: '#ffffff',
      },
    });
    const qrBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');

    return new Promise((resolve, reject) => {
      // Formato A4 com cartão centralizado para impressão / visualização
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: `Carteira Estudantil - ${params.estudante.nome}`,
          Author: params.instituicao.nome,
          Subject: 'Identidade Estudantil Digital AcadChain',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('error', (err) => reject(err));

      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        const fileHashSha256 = createHash('sha256').update(pdfBuffer).digest('hex');

        fs.writeFileSync(filePath, pdfBuffer);

        try {
          const db = getDatabase();
          db.prepare(`
            UPDATE documentos 
            SET hash_sha256_pdf = ?, caminho_arquivo_pdf = ?
            WHERE uuid_publico = ?
          `).run(fileHashSha256, relativeFilePath, params.uuid);
        } catch (dbErr: any) {
          console.warn('[PdfService] Aviso ao persistir hash do PDF no banco:', dbErr.message);
        }

        resolve({
          filePath,
          relativeFilePath,
          pdfBuffer,
          fileHashSha256,
        });
      });

      const cardWidth = 480;
      const cardHeight = 280;
      const cardX = (doc.page.width - cardWidth) / 2;
      const cardY = 120;

      // Sombra e Fundo do Cartão
      doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 12)
        .fillColor('#ffffff')
        .fillAndStroke('#cbd5e1');

      // Cabeçalho do Cartão (Navy AcadChain)
      doc.save();
      doc.roundedRect(cardX, cardY, cardWidth, 65, 12).clip();
      doc.rect(cardX, cardY, cardWidth, 65).fillColor('#0f2942').fill();
      // Faixa de destaque verde
      doc.rect(cardX, cardY + 60, cardWidth, 5).fillColor('#10b981').fill();
      doc.restore();

      // Textos do Cabeçalho do Cartão
      doc.fillColor('#ffffff')
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('CARTEIRA DE IDENTIFICAÇÃO ESTUDANTIL', cardX + 20, cardY + 16);

      doc.fillColor('#94a3b8')
        .fontSize(9)
        .font('Helvetica')
        .text(
          `${params.instituicao.nome} (${params.instituicao.sigla}) - AcadChain Consórcio`,
          cardX + 20,
          cardY + 36
        );

      // Foto / Avatar Placeholder do Estudante
      const photoX = cardX + 24;
      const photoY = cardY + 85;
      const photoWidth = 85;
      const photoHeight = 110;

      doc.roundedRect(photoX, photoY, photoWidth, photoHeight, 6)
        .fillColor('#f1f5f9')
        .fillAndStroke('#cbd5e1');

      // Ícone simbólico de usuário
      doc.circle(photoX + photoWidth / 2, photoY + 40, 20).fillColor('#cbd5e1').fill();
      doc.circle(photoX + photoWidth / 2, photoY + 95, 30).fillColor('#cbd5e1').fill();
      doc.fillColor('#64748b')
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('FOTO DIGITAL', photoX, photoY + 90, { width: photoWidth, align: 'center' });

      // Dados do Estudante
      const infoX = cardX + 125;
      const infoY = cardY + 85;

      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica-Bold').text('NOME DO ESTUDANTE', infoX, infoY);
      doc.fillColor('#0f2942').fontSize(11).font('Helvetica-Bold').text(params.estudante.nome, infoX, infoY + 11);

      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica-Bold').text('CURSO REGULAR', infoX, infoY + 32);
      doc.fillColor('#1e293b').fontSize(10).font('Helvetica').text(params.matricula.curso, infoX, infoY + 43);

      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica-Bold').text('MATRÍCULA', infoX, infoY + 62);
      doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold').text(params.matricula.numero, infoX, infoY + 73);

      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica-Bold').text('CPF', infoX + 130, infoY + 62);
      doc.fillColor('#1e293b').fontSize(10).font('Helvetica').text(params.estudante.cpf, infoX + 130, infoY + 73);

      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica-Bold').text('VALIDADE', infoX, infoY + 92);
      doc.fillColor('#10b981').fontSize(10).font('Helvetica-Bold').text(params.dataValidade || '31/03/2027', infoX, infoY + 103);

      // QR Code no Cartão
      const qrX = cardX + cardWidth - 115;
      const qrY = cardY + 85;
      doc.image(qrBuffer, qrX, qrY, { width: 95, height: 95 });
      doc.fillColor('#64748b')
        .fontSize(6.5)
        .font('Helvetica')
        .text('Validação On-Chain', qrX, qrY + 97, { width: 95, align: 'center' });

      // Rodapé do Cartão
      const footerY = cardY + cardHeight - 40;
      doc.rect(cardX + 1, footerY, cardWidth - 2, 38).fillColor('#f8fafc').fill();
      doc.fillColor('#475569')
        .fontSize(7)
        .font('Helvetica')
        .text(
          `ID Único: ${params.uuid} | Prova Criptográfica SHA-256 Registrada em Smart Contract`,
          cardX + 15,
          footerY + 8
        );
      doc.fillColor('#94a3b8')
        .fontSize(6.5)
        .font('Helvetica-Oblique')
        .text(
          'Protótipo AcadChain para pesquisa científica. Não substitui DNE oficial da UNE/ANPG/UBES.',
          cardX + 15,
          footerY + 22
        );

      // Instruções de impressão fora do cartão
      doc.fillColor('#94a3b8')
        .fontSize(9)
        .font('Helvetica')
        .text('Linha de corte do cartão estudantil digital (formato padrão ID-1)', 40, cardY + cardHeight + 25, {
          align: 'center',
        });

      doc.end();
    });
  }

  /**
   * Recupera ou gera sob demanda o PDF para um documento registrado no SQLite.
   */
  public static async getOrGeneratePdfForDocumento(uuidOrId: string): Promise<GeneratedPdfResult> {
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

    const doc = db.prepare(query).get(uuidOrId, uuidOrId) as any;
    if (!doc) {
      throw new Error(`Documento '${uuidOrId}' não encontrado.`);
    }

    const docsDir = this.getDocumentsDir();
    const prefix = doc.tipo === 'CARTEIRINHA' ? 'carteirinha' : doc.tipo.toLowerCase();
    const fileName = `${prefix}-${doc.uuid_publico}.pdf`;
    const filePath = path.resolve(docsDir, fileName);

    // Se o arquivo já existe e o hash está no banco, lê e retorna
    if (fs.existsSync(filePath) && doc.hash_sha256_pdf) {
      const pdfBuffer = fs.readFileSync(filePath);
      const computedHash = createHash('sha256').update(pdfBuffer).digest('hex');
      return {
        filePath,
        relativeFilePath: `dados/documentos/${fileName}`,
        pdfBuffer,
        fileHashSha256: computedHash,
      };
    }

    // Caso contrário, gera novo PDF
    const params: DocumentoPdfParams = {
      id: doc.id,
      uuid: doc.uuid_publico,
      tipo: doc.tipo,
      titulo: doc.titulo,
      descricao: doc.descricao,
      dataEmissao: doc.data_emissao,
      dataValidade: doc.data_validade,
      estudante: {
        nome: doc.estudante_nome,
        cpf: doc.estudante_cpf,
        email: doc.estudante_email,
      },
      matricula: {
        numero: doc.numero_matricula,
        curso: doc.curso,
        nivel: doc.nivel,
      },
      instituicao: {
        sigla: doc.instituicao_sigla,
        nome: doc.instituicao_nome,
        codigoMec: doc.codigo_mec_ficticio,
      },
    };

    if (doc.tipo === 'CARTEIRINHA') {
      return await this.generateStudentCardPdf(params);
    } else {
      return await this.generateDiplomaOrCertificadoPdf(params);
    }
  }
}
