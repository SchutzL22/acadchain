import { Instituicao, Estudante, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export async function checkBackendHealth(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) {
    throw new Error(`Falha no healthcheck da API: ${res.status}`);
  }
  return res.json();
}

export async function fetchInstituicoes(): Promise<Instituicao[]> {
  const res = await fetch(`${API_BASE_URL}/instituicoes`);
  if (!res.ok) {
    throw new Error(`Erro ao buscar instituições: ${res.statusText}`);
  }
  const json: ApiResponse<Instituicao[]> = await res.json();
  return json.dados || [];
}

export async function fetchEstudantes(): Promise<Estudante[]> {
  const res = await fetch(`${API_BASE_URL}/estudantes`);
  if (!res.ok) {
    throw new Error(`Erro ao buscar estudantes: ${res.statusText}`);
  }
  const json: ApiResponse<Estudante[]> = await res.json();
  return json.dados || [];
}
