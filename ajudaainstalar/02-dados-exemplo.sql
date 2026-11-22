-- AcadChain: Script 02 - Inserção de Dados Fictícios de Demonstração
-- Execução idempotente com INSERT OR IGNORE para prevenir duplicações

PRAGMA foreign_keys = ON;

-- 1. Instituições Fictícias de Ensino Superior
INSERT OR IGNORE INTO instituicoes (id, codigo_mec_ficticio, nome, sigla, cnpj_ficticio, cidade, estado, tipo, status, endereco_blockchain_planejado)
VALUES
(1, 'IES-901', 'Universidade Federal do Saber', 'UFS', '00.123.456/0001-99', 'Brasília', 'DF', 'Pública Federal', 'ATIVA', '0x1111111111111111111111111111111111111111'),
(2, 'IES-902', 'Instituto Tecnológico do Brasil', 'ITB', '11.234.567/0001-88', 'São Paulo', 'SP', 'Pública Estadual', 'ATIVA', '0x2222222222222222222222222222222222222222'),
(3, 'IES-903', 'Pontifícia Universidade Integrada', 'PUI', '22.345.678/0001-77', 'Curitiba', 'PR', 'Privada Comunitária', 'ATIVA', '0x3333333333333333333333333333333333333333');

-- 2. Estudantes Fictícios
INSERT OR IGNORE INTO estudantes (id, cpf_ficticio, nome_completo, email, data_nascimento)
VALUES
(1, '111.222.333-44', 'Ana Beatriz Silveira', 'ana.silveira@exemplo.edu.br', '2001-04-15'),
(2, '222.333.444-55', 'Carlos Eduardo Moreira', 'carlos.moreira@exemplo.edu.br', '1999-08-22'),
(3, '333.444.555-66', 'Daniela Martins Rocha', 'daniela.rocha@exemplo.edu.br', '2002-11-03'),
(4, '444.555.666-77', 'Eduardo Lima Farias', 'eduardo.farias@exemplo.edu.br', '2000-01-30'),
(5, '555.666.777-88', 'Fernanda Cristina Dias', 'fernanda.dias@exemplo.edu.br', '1998-07-19');

-- 3. Usuários Operacionais Fictícios
INSERT OR IGNORE INTO usuarios (id, nome, email, papel, instituicao_id)
VALUES
(1, 'Administrador do Consórcio', 'admin@acadchain.local', 'ADMIN_GERAL', NULL),
(2, 'Secretaria Acadêmica UFS', 'secretaria@ufs.edu.br', 'GESTOR_INSTITUICAO', 1),
(3, 'Coordenação de Registro ITB', 'registro@itb.edu.br', 'GESTOR_INSTITUICAO', 2),
(4, 'Auditoria Externa MEC Simulado', 'auditoria@mec-simulado.gov.br', 'AUDITOR', NULL);

-- 4. Matrículas Fictícias
INSERT OR IGNORE INTO matriculas (id, estudante_id, instituicao_id, numero_matricula, curso, nivel, ano_ingresso, status)
VALUES
(1, 1, 1, 'UFS-2021-CC-001', 'Ciência da Computação', 'GRADUACAO', 2021, 'REGULAR'),
(2, 2, 1, 'UFS-2019-SI-045', 'Sistemas de Informação', 'GRADUACAO', 2019, 'CONCLUIDO'),
(3, 3, 2, 'ITB-2022-ES-102', 'Engenharia de Software', 'GRADUACAO', 2022, 'REGULAR'),
(4, 4, 3, 'PUI-2020-DIR-088', 'Direito', 'GRADUACAO', 2020, 'REGULAR'),
(5, 5, 2, 'ITB-2023-IA-501', 'Inteligência Artificial Aplicada', 'POS_GRADUACAO', 2023, 'CONCLUIDO');

-- 5. Documentos Fictícios com Hashes SHA-256 e UUIDs
INSERT OR IGNORE INTO documentos (id, uuid_publico, matricula_id, tipo, titulo, descricao, data_emissao, data_validade, hash_sha256_conteudo, status)
VALUES
(1, 'a1b2c3d4-e5f6-47a8-b9c0-111111111111', 2, 'DIPLOMA', 'Diploma de Bacharelado em Sistemas de Informação', 'Conclusão formal de graduação de Carlos Eduardo Moreira na UFS', '2023-12-18', NULL, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'EMITIDO'),
(2, 'b2c3d4e5-f6a7-48b9-c0d1-222222222222', 1, 'CARTEIRINHA', 'Carteirinha de Estudante Digital 2026', 'Identificação discente ativa de Ana Beatriz Silveira na UFS', '2026-01-10', '2026-12-31', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'EMITIDO'),
(3, 'c3d4e5f6-a7b8-49c0-d1e2-333333333333', 5, 'CERTIFICADO', 'Certificado de Especialista em Inteligência Artificial', 'Certificado de pós-graduação lato sensu emitido pelo ITB', '2024-06-25', NULL, '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce', 'EMITIDO'),
(4, 'd4e5f6a7-b8c9-40d1-e2f3-444444444444', 3, 'CARTEIRINHA', 'Carteirinha de Estudante Digital 2026', 'Identificação discente ativa de Daniela Martins Rocha no ITB', '2026-02-01', '2026-12-31', '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a', 'EMITIDO');

-- 6. Registro Inicial de Auditoria
INSERT OR IGNORE INTO auditoria (id, acao, tabela_afetada, registro_id, detalhes, usuario_id)
VALUES
(1, 'SISTEMA_INICIALIZADO', 'sistema', 1, 'Banco de dados criado e populado com dados fictícios de demonstração acadêmica', 1);
