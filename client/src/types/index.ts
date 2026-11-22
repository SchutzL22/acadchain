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
  descricao?: string;
  data_emissao: string;
  hash_sha256_conteudo: string;
  hash_sha256_pdf?: string | null;
  caminho_arquivo_pdf?: string | null;
  status: 'EMITIDO' | 'REVOGADO' | 'EXPIRADO';
  tx_hash_blockchain?: string | null;
  bloco_blockchain?: number | null;
  smart_contract_address?: string | null;
  status_sincronizacao?: 'NAO_SINCRONIZADO' | 'PENDENTE' | 'CONFIRMADO_ONCHAIN' | 'FALHA_ONCHAIN' | 'REVOGADO_ONCHAIN';
  curso?: string;
  nivel?: string;
  numero_matricula?: string;
  instituicao_id?: number;
  instituicao_sigla?: string;
  instituicao_nome?: string;
  estudante_id?: number;
  estudante_nome?: string;
  estudante_cpf?: string;
  revogado_em?: string | null;
  motivo_revogacao?: string | null;
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

export interface BlockchainStatus {
  online: boolean;
  rpcUrl?: string;
  chainId?: number;
  blocoAtual?: number;
  contratoImplantado?: boolean;
  redeReiniciada?: boolean;
  mensagem?: string;
  contrato?: {
    endereco: string;
    deployer: string;
    blocoDeploy: number;
    dataDeploy: string;
    totalEmitidas: number;
    totalRevogadas: number;
  };
  instituicoesAutorizadas?: {
    id: number;
    sigla: string;
    nome: string;
    address: string;
    role: string;
  }[];
  erro?: string;
}

export interface TransacaoBlockchain {
  id: number;
  tipo_operacao: 'DEPLOY' | 'AUTORIZAR_EMISSOR' | 'EMISSAO' | 'REVOGACAO';
  tx_hash: string;
  bloco: number;
  de_endereco: string;
  para_endereco: string;
  status: 'PENDENTE' | 'CONFIRMADA' | 'FALHA';
  detalhes: string;
  criado_em: string;
  uuid_publico?: string;
  documento_titulo?: string;
}

export interface ApiResponse<T> {
  sucesso: boolean;
  mensagem?: string;
  dados?: T;
  erro?: string;
  total?: number;
}

export interface CarteirinhaData extends DocumentoResumo {
  matricula_id: number;
  matricula_status: string;
  codigo_mec_ficticio: string;
  estudante_email?: string;
  data_validade?: string;
  verificarUrl: string;
  estadoBlockchain?: any;
}

export interface VerificacaoPdfResult {
  sucesso: boolean;
  autentico: boolean;
  motivo: string;
  hashArquivoSha256?: string;
  hashCalculado?: string;
  hashCanonicoCalculado?: string;
  hashRegistradoNoBanco?: string;
  tamanhoBytes?: number;
  nomeOriginal?: string;
  duplaCamada?: {
    metadadosCanonicosValidos: boolean;
    arquivoFisicoValido: boolean;
  };
  documento?: {
    uuid: string;
    tipo: 'DIPLOMA' | 'CERTIFICADO' | 'CARTEIRINHA';
    titulo: string;
    estudante: string;
    cpf: string;
    curso: string;
    matricula: string;
    instituicao: string;
    siglaInstituicao: string;
    dataEmissao: string;
    status: string;
    statusSincronizacao: string;
    txHash: string;
    bloco: number;
  };
}
