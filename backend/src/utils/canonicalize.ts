import { createHash } from 'node:crypto';
import { keccak256, stringToHex, toHex } from 'viem';

export interface CanonicalAcademicData {
  schemaVersion: '1.0';
  documentoId: string;       // UUID ou identificador
  tipoDocumento: 'DIPLOMA' | 'CERTIFICADO' | 'CARTEIRINHA';
  instituicaoSigla: string;
  instituicaoCodigoMec: string;
  estudanteCpf: string;
  estudanteNome: string;
  cursoNome: string;
  numeroMatricula: string;
  dataEmissao: string;       // YYYY-MM-DD
}

/**
 * Normaliza e serializa os dados acadêmicos em um formato canônico e determinístico (RFC 8785 / JCS simplificado).
 * 1. Campos ordenados alfabeticamente por chave.
 * 2. Espaços extras removidos (trim).
 * 3. Textos normalizados em Unicode NFC.
 * 4. Strings formatadas sem espaços entre delimitadores.
 */
export function canonicalizeAcademicData(data: CanonicalAcademicData): string {
  const normalized = {
    cursoNome: data.cursoNome.normalize('NFC').trim(),
    dataEmissao: data.dataEmissao.trim(),
    documentoId: data.documentoId.toLowerCase().trim(),
    estudanteCpf: data.estudanteCpf.replace(/\D/g, ''), // apenas números
    estudanteNome: data.estudanteNome.normalize('NFC').trim(),
    instituicaoCodigoMec: data.instituicaoCodigoMec.trim(),
    instituicaoSigla: data.instituicaoSigla.toUpperCase().trim(),
    numeroMatricula: data.numeroMatricula.trim(),
    schemaVersion: '1.0' as const,
    tipoDocumento: data.tipoDocumento,
  };

  // Serialização ordenada estrita
  const keys = Object.keys(normalized).sort() as (keyof typeof normalized)[];
  const canonicalEntries = keys.map((key) => `"${key}":"${normalized[key]}"`);
  return `{${canonicalEntries.join(',')}}`;
}

/**
 * Calcula o hash SHA-256 (64 hexadecimais) dos dados acadêmicos canônicos.
 */
export function computeCanonicalSha256(data: CanonicalAcademicData): string {
  const canonicalString = canonicalizeAcademicData(data);
  return createHash('sha256').update(canonicalString, 'utf8').digest('hex');
}

/**
 * Deriva um bytes32 para a blockchain a partir do UUID ou string identificadora.
 */
export function deriveCredentialId(uuid: string): `0x${string}` {
  return keccak256(stringToHex(uuid.toLowerCase().trim()));
}
