export interface Instituicao {
  id: number;
  codigo_mec_ficticio: string;
  nome: string;
  sigla: string;
  cnpj_ficticio: string;
  cidade: string;
  estado: string;
  tipo: 'Pública Federal' | 'Pública Estadual' | 'Privada Comunitária' | 'Privada Particular';
  status: 'ATIVA' | 'SUSPENSA' | 'INATIVA';
  endereco_blockchain_planejado?: string | null;
  criado_em: string;
  total_matriculas?: number;
  total_documentos?: number;
}
