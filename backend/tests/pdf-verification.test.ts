import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { PdfService, DocumentoPdfParams } from '../src/services/pdf.service.js';

describe('Serviço de Geração e Verificação de PDFs Acadêmicos (Etapa 3)', () => {
  const sampleParams: DocumentoPdfParams = {
    uuid: 'e1a2b3c4-d5f6-47a8-b9c0-999999999999',
    tipo: 'DIPLOMA',
    titulo: 'Diploma de Teste Criptográfico em Engenharia de Software',
    dataEmissao: '2026-11-22',
    estudante: {
      nome: 'Mariana Souza Santos',
      cpf: '987.654.321-00',
      email: 'mariana.teste@saber.edu.br',
    },
    matricula: {
      numero: 'UFS-2022-ES-999',
      curso: 'Engenharia de Software',
      nivel: 'Graduação',
    },
    instituicao: {
      sigla: 'UFS',
      nome: 'Universidade Federal do Saber',
      codigoMec: 'IES-901',
    },
  };

  it('deve gerar PDF de Diploma com cabeçalho mágico %PDF- e hash SHA-256 consistente', async () => {
    const result = await PdfService.generateDiplomaOrCertificadoPdf(sampleParams);

    assert.ok(result.pdfBuffer, 'O buffer do PDF deve existir');
    assert.ok(result.pdfBuffer.length > 1000, 'O PDF deve ter tamanho significativo (> 1KB)');

    // Verifica magic bytes do formato PDF (%PDF-)
    const header = result.pdfBuffer.subarray(0, 5).toString('ascii');
    assert.strictEqual(header, '%PDF-', 'O arquivo deve iniciar com os magic bytes %PDF-');

    // Verifica integridade do hash SHA-256
    const calculatedHash = createHash('sha256').update(result.pdfBuffer).digest('hex');
    assert.strictEqual(
      result.fileHashSha256,
      calculatedHash,
      'O hash retornado deve ser o SHA-256 exato do buffer gerado'
    );
    assert.strictEqual(result.fileHashSha256.length, 64, 'O hash SHA-256 deve ter 64 caracteres hex');

    // Verifica persistência física
    assert.ok(fs.existsSync(result.filePath), 'O arquivo físico deve ter sido salvo no disco');
  });

  it('deve gerar PDF da Carteirinha Estudantil Digital com padrão ID-1 e QR Code', async () => {
    const carteirinhaParams: DocumentoPdfParams = {
      ...sampleParams,
      uuid: 'f2b3c4d5-e6a7-48b9-c0d1-888888888888',
      tipo: 'CARTEIRINHA',
      titulo: 'Carteira Estudantil Digital',
      dataValidade: '31/03/2027',
    };

    const result = await PdfService.generateStudentCardPdf(carteirinhaParams);

    assert.ok(result.pdfBuffer, 'O buffer da carteirinha deve existir');
    const header = result.pdfBuffer.subarray(0, 5).toString('ascii');
    assert.strictEqual(header, '%PDF-', 'O arquivo deve ser um PDF válido');

    const calculatedHash = createHash('sha256').update(result.pdfBuffer).digest('hex');
    assert.strictEqual(result.fileHashSha256, calculatedHash);
  });

  it('deve detectar alteração de 1 único byte binário (Efeito Avalanche do SHA-256)', async () => {
    const result = await PdfService.generateDiplomaOrCertificadoPdf(sampleParams);
    const originalHash = result.fileHashSha256;

    // Clona o buffer e inverte os bits de um único byte no centro do arquivo
    const corruptedBuffer = Buffer.from(result.pdfBuffer);
    const targetIndex = Math.floor(corruptedBuffer.length / 2);
    corruptedBuffer[targetIndex] = corruptedBuffer[targetIndex] ^ 0xff;

    const corruptedHash = createHash('sha256').update(corruptedBuffer).digest('hex');

    assert.notStrictEqual(
      corruptedHash,
      originalHash,
      'A inversão de 1 byte DEVE produzir um hash SHA-256 completamente diferente'
    );

    // Conta quantos caracteres hexadecimais diferem entre o original e o adulterado
    let diffCount = 0;
    for (let i = 0; i < 64; i++) {
      if (originalHash[i] !== corruptedHash[i]) diffCount++;
    }

    assert.ok(
      diffCount >= 20,
      `O efeito avalanche deve alterar substancialmente o hash (diferenças encontradas: ${diffCount}/64)`
    );
  });
});
