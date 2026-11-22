-- AcadChain: Script 03 - Consultas de Verificação e Validação do Banco de Dados

-- 1. Contagem Geral de Registros por Tabela
SELECT 'instituicoes' AS tabela, COUNT(*) AS total FROM instituicoes
UNION ALL
SELECT 'estudantes', COUNT(*) FROM estudantes
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'matriculas', COUNT(*) FROM matriculas
UNION ALL
SELECT 'documentos', COUNT(*) FROM documentos
UNION ALL
SELECT 'auditoria', COUNT(*) FROM auditoria;

-- 2. Lista de Instituições com Total de Matrículas e Documentos
SELECT 
    i.sigla,
    i.nome,
    i.tipo,
    i.status,
    COUNT(DISTINCT m.id) AS total_matriculas,
    COUNT(DISTINCT d.id) AS total_documentos
FROM instituicoes i
LEFT JOIN matriculas m ON m.instituicao_id = i.id
LEFT JOIN documentos d ON d.matricula_id = m.id
GROUP BY i.id;

-- 3. Relação Completa: Estudante -> Instituição -> Curso -> Documentos Emitidos
SELECT 
    e.nome_completo AS estudante,
    e.cpf_ficticio,
    i.sigla AS instituicao,
    m.curso,
    m.status AS status_matricula,
    d.tipo AS tipo_documento,
    d.uuid_publico,
    d.hash_sha256_conteudo,
    d.status AS status_documento
FROM estudantes e
JOIN matriculas m ON m.estudante_id = e.id
JOIN instituicoes i ON i.id = m.instituicao_id
LEFT JOIN documentos d ON d.matricula_id = m.id
ORDER BY e.nome_completo;
