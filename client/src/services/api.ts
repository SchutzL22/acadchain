import {
  Instituicao,
  Estudante,
  DocumentoResumo,
  BlockchainStatus,
  TransacaoBlockchain,
  ApiResponse,
} from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export async function checkBackendHealth(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error(`Healthcheck falhou: ${res.status}`);
  return res.json();
}

export async function fetchInstituicoes(): Promise<Instituicao[]> {
  const res = await fetch(`${API_BASE_URL}/instituicoes`);
  if (!res.ok) throw new Error(`Erro ao buscar instituições: ${res.statusText}`);
  const json: ApiResponse<Instituicao[]> = await res.json();
  return json.dados || [];
}

export async function fetchEstudantes(): Promise<Estudante[]> {
  const res = await fetch(`${API_BASE_URL}/estudantes`);
  if (!res.ok) throw new Error(`Erro ao buscar estudantes: ${res.statusText}`);
  const json: ApiResponse<Estudante[]> = await res.json();
  return json.dados || [];
}

export async function fetchBlockchainStatus(): Promise<BlockchainStatus> {
  const res = await fetch(`${API_BASE_URL}/blockchain/status`);
  if (!res.ok) throw new Error(`Falha ao consultar blockchain: ${res.statusText}`);
  const json = await res.json();
  return json.dados;
}

export async function fetchBlockchainTransacoes(limit = 20): Promise<TransacaoBlockchain[]> {
  const res = await fetch(`${API_BASE_URL}/blockchain/transacoes?limit=${limit}`);
  if (!res.ok) throw new Error(`Falha ao consultar transações: ${res.statusText}`);
  const json: ApiResponse<TransacaoBlockchain[]> = await res.json();
  return json.dados || [];
}

export async function fetchCredenciais(): Promise<DocumentoResumo[]> {
  const res = await fetch(`${API_BASE_URL}/credenciais`);
  if (!res.ok) throw new Error(`Falha ao consultar credenciais: ${res.statusText}`);
  const json: ApiResponse<DocumentoResumo[]> = await res.json();
  return json.dados || [];
}

export async function fetchCredencialById(idOrUuid: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/credenciais/${encodeURIComponent(idOrUuid)}`);
  if (!res.ok) throw new Error(`Credencial não encontrada: ${res.statusText}`);
  const json = await res.json();
  return json.dados;
}

export async function verificarCredencial(
  idOrUuid: string,
  claimedHash?: string
): Promise<{
  sucesso: boolean;
  valido: boolean;
  motivo: string;
  comparativo: {
    hashCalculado: string;
    hashReivindicado: string;
    hashRegistradoNoBanco: string;
    coincidem: boolean;
  };
  documento: any;
}> {
  let url = `${API_BASE_URL}/credenciais/${encodeURIComponent(idOrUuid)}/verificar`;
  if (claimedHash) {
    url += `?claimedHash=${encodeURIComponent(claimedHash)}`;
  }
  const res = await fetch(url);
  return res.json();
}

export async function emitirCredencial(dados: {
  matriculaId: number;
  tipo: string;
  titulo: string;
  descricao?: string;
  dataEmissao: string;
  instituicaoId?: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/credenciais/emitir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.erro || 'Falha ao emitir credencial');
  return json;
}

export async function revogarCredencial(
  idOrUuid: string,
  motivo: string,
  instituicaoId?: number
): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/credenciais/${encodeURIComponent(idOrUuid)}/revogar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motivo, instituicaoId }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.erro || 'Falha ao revogar credencial');
  return json;
}
