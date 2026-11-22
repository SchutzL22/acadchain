-- AcadChain: Script 01 - Criação de Tabelas e Esquema Relacional
-- Compatível com SQLite 3 e node:sqlite (Node.js 24+)

PRAGMA foreign_keys = ON;

-- 1. Tabela de Instituições de Ensino Superior (IES)
CREATE TABLE IF NOT EXISTS instituicoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_mec_ficticio TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    sigla TEXT NOT NULL UNIQUE,
    cnpj_ficticio TEXT NOT NULL UNIQUE,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL CHECK(length(estado) = 2),
    tipo TEXT NOT NULL CHECK(tipo IN ('Pública Federal', 'Pública Estadual', 'Privada Comunitária', 'Privada Particular')),
    status TEXT NOT NULL DEFAULT 'ATIVA' CHECK(status IN ('ATIVA', 'SUSPENSA', 'INATIVA')),
    endereco_blockchain_planejado TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Estudantes (Pessoas Físicas Fictícias)
CREATE TABLE IF NOT EXISTS estudantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpf_ficticio TEXT NOT NULL UNIQUE,
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Usuários do Sistema
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    papel TEXT NOT NULL CHECK(papel IN ('ADMIN_GERAL', 'GESTOR_INSTITUICAO', 'AUDITOR', 'ESTUDANTE')),
    instituicao_id INTEGER REFERENCES instituicoes(id) ON DELETE SET NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Matrículas e Vínculos Acadêmicos
CREATE TABLE IF NOT EXISTS matriculas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudante_id INTEGER NOT NULL REFERENCES estudantes(id) ON DELETE CASCADE,
    instituicao_id INTEGER NOT NULL REFERENCES instituicoes(id) ON DELETE RESTRICT,
    numero_matricula TEXT NOT NULL,
    curso TEXT NOT NULL,
    nivel TEXT NOT NULL CHECK(nivel IN ('GRADUACAO', 'POS_GRADUACAO', 'TECNICO', 'MESTRADO', 'DOUTORADO')),
    ano_ingresso INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'REGULAR' CHECK(status IN ('REGULAR', 'CONCLUIDO', 'TRANCADO', 'CANCELADO')),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(instituicao_id, numero_matricula)
);

-- 5. Tabela de Documentos Emitidos (Diplomas, Certificados e Carteirinhas)
CREATE TABLE IF NOT EXISTS documentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid_publico TEXT NOT NULL UNIQUE,
    matricula_id INTEGER NOT NULL REFERENCES matriculas(id) ON DELETE RESTRICT,
    tipo TEXT NOT NULL CHECK(tipo IN ('DIPLOMA', 'CERTIFICADO', 'CARTEIRINHA')),
    titulo TEXT NOT NULL,
    descricao TEXT,
    data_emissao DATE NOT NULL,
    data_validade DATE,
    hash_sha256_conteudo TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'EMITIDO' CHECK(status IN ('EMITIDO', 'REVOGADO', 'EXPIRADO')),
    tx_hash_blockchain TEXT,
    bloco_blockchain INTEGER,
    smart_contract_address TEXT,
    endereco_emissor_blockchain TEXT,
    status_sincronizacao TEXT NOT NULL DEFAULT 'NAO_SINCRONIZADO' CHECK(status_sincronizacao IN ('NAO_SINCRONIZADO', 'PENDENTE', 'CONFIRMADO_ONCHAIN', 'FALHA_ONCHAIN', 'REVOGADO_ONCHAIN')),
    dados_canonicos_json TEXT,
    revogado_em DATETIME,
    motivo_revogacao TEXT,
    hash_sha256_pdf TEXT,
    caminho_arquivo_pdf TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela de Auditoria de Ações Administrativas
CREATE TABLE IF NOT EXISTS auditoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acao TEXT NOT NULL,
    tabela_afetada TEXT NOT NULL,
    registro_id INTEGER NOT NULL,
    detalhes TEXT,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Histórico de Transações e Operações na Blockchain
CREATE TABLE IF NOT EXISTS transacoes_blockchain (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    documento_id INTEGER REFERENCES documentos(id) ON DELETE CASCADE,
    tipo_operacao TEXT NOT NULL CHECK(tipo_operacao IN ('DEPLOY', 'AUTORIZAR_EMISSOR', 'EMISSAO', 'REVOGACAO')),
    tx_hash TEXT NOT NULL UNIQUE,
    bloco INTEGER,
    de_endereco TEXT NOT NULL,
    para_endereco TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('PENDENTE', 'CONFIRMADA', 'FALHA')),
    detalhes TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Otimização
CREATE INDEX IF NOT EXISTS idx_instituicoes_sigla ON instituicoes(sigla);
CREATE INDEX IF NOT EXISTS idx_estudantes_cpf ON estudantes(cpf_ficticio);
CREATE INDEX IF NOT EXISTS idx_matriculas_estudante ON matriculas(estudante_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_instituicao ON matriculas(instituicao_id);
CREATE INDEX IF NOT EXISTS idx_documentos_uuid ON documentos(uuid_publico);
CREATE INDEX IF NOT EXISTS idx_documentos_hash ON documentos(hash_sha256_conteudo);
CREATE INDEX IF NOT EXISTS idx_documentos_sync ON documentos(status_sincronizacao);
CREATE INDEX IF NOT EXISTS idx_auditoria_tabela ON auditoria(tabela_afetada, registro_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_tx ON transacoes_blockchain(tx_hash);
