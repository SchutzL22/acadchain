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

export interface Matricula {
  id: number;
  instituicao_id: number;
  instituicao_sigla?: string;
  instituicao_nome?: string;
  numero_matricula: string;
  curso: string;
  nivel: 'GRADUACAO' | 'POS_GRADUACAO' | 'TECNICO' | 'MESTRADO' | 'DOUTORADO';
  ano_ingresso: number;
  status: 'REGULAR' | 'CONCLUIDO' | 'TRANCADO' | 'CANCELADO';
}

export interface DocumentoResumo {
  id: number;
  uuid_publico: string;
  tipo: 'DIPLOMA' | 'CERTIFICADO' | 'CARTEIRINHA';
  titulo: string;
  data_emissao: string;
  hash_sha256_conteudo: string;
  status: 'EMITIDO' | 'REVOGADO' | 'EXPIRADO';
}

export interface Estudante {
  id: number;
  cpf_ficticio: string;
  nome_completo: string;
  email: string;
  data_nascimento: string;
  criado_em: string;
  matriculas?: Matricula[];
  documentos?: DocumentoResumo[];
}

export interface ApiResponse<T> {
  sucesso: boolean;
  mensagem?: string;
  dados?: T;
  erro?: string;
  total?: number;
}
