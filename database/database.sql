-- =========================================================
-- database.sql
-- Banco de dados do Sistema de Gerenciamento de Clubes - IFMS
-- Campus Nova Andradina
--
-- Este script:
-- 1. Cria o banco de dados
-- 2. Cria as tabelas
-- 3. Insere dados de teste (usuários, membros do grêmio,
--    clubes, membros de clube, atividades e solicitações)
--
-- IMPORTANTE: os dados abaixo são apenas para desenvolvimento
-- local. Senhas estão em texto puro de propósito, pois nesta
-- fase ainda não existe login nem hash de senha.
-- =========================================================

-- 1. CRIAÇÃO DO BANCO
DROP DATABASE IF EXISTS clubes_ifms;
CREATE DATABASE clubes_ifms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clubes_ifms;

-- =========================================================
-- 2. CRIAÇÃO DAS TABELAS
-- =========================================================

-- Tabela: usuarios
-- Guarda todos os usuários do sistema (alunos, membros do
-- grêmio, presidentes de clube). Nesta fase não existe campo
-- de "nível" de acesso.
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: membros_gremio
-- Relaciona usuários que fazem parte do Grêmio Estudantil.
CREATE TABLE membros_gremio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela: clubes
-- Cada clube tem um nome, um resumo, um banner (URL de imagem)
-- e, opcionalmente, um presidente (usuário responsável).
CREATE TABLE clubes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    resumo TEXT,
    banner VARCHAR(255),
    presidente_id INT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (presidente_id) REFERENCES usuarios(id)
);

-- Tabela: membros_clube
-- Relação N:N entre usuários e clubes: um usuário pode
-- participar de vários clubes, e um clube tem vários membros.
CREATE TABLE membros_clube (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    clube_id INT NOT NULL,
    status ENUM('ATIVO', 'INATIVO') DEFAULT 'ATIVO',
    data_entrada DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (clube_id) REFERENCES clubes(id)
);

-- Tabela: atividades
-- Horários/atividades recorrentes de cada clube.
CREATE TABLE atividades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clube_id INT NOT NULL,
    dia_semana ENUM('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'),
    hora_inicio TIME,
    hora_fim TIME,
    local VARCHAR(150),
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (clube_id) REFERENCES clubes(id)
);

-- Tabela: solicitacoes
-- Pedidos de inscrição em clube ou de criação de novo clube.
-- Nesta fase a tabela só existe na modelagem; o fluxo de
-- aprovação ainda não é implementado.
CREATE TABLE solicitacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    clube_id INT NULL,
    tipo ENUM('INSCRICAO', 'CRIACAO_CLUBE') NOT NULL,
    status ENUM('PENDENTE', 'APROVADA', 'REJEITADA') DEFAULT 'PENDENTE',
    mensagem TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analisado_em TIMESTAMP NULL,
    analisado_por INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (clube_id) REFERENCES clubes(id),
    FOREIGN KEY (analisado_por) REFERENCES usuarios(id)
);

-- =========================================================
-- 3. DADOS DE TESTE
-- =========================================================

-- Usuários
INSERT INTO usuarios (nome, email, senha) VALUES
('Ana Beatriz Souza', 'ana.souza@estudante.ifms.edu.br', '123456'),
('Carlos Eduardo Lima', 'carlos.lima@estudante.ifms.edu.br', '123456'),
('Fernanda Ribeiro', 'fernanda.ribeiro@estudante.ifms.edu.br', '123456'),
('João Pedro Alves', 'joao.alves@estudante.ifms.edu.br', '123456'),
('Marina Costa', 'marina.costa@estudante.ifms.edu.br', '123456'),
('Rafael Nunes', 'rafael.nunes@estudante.ifms.edu.br', '123456');

-- Membros do Grêmio
INSERT INTO membros_gremio (usuario_id, cargo) VALUES
(1, 'Presidente do Grêmio'),
(2, 'Vice-presidente do Grêmio'),
(3, 'Secretária');

-- Clubes (pelo menos 3)
INSERT INTO clubes (nome, resumo, banner, presidente_id) VALUES
('Clube de Robótica', 'Grupo de estudos e projetos práticos de robótica e automação.', 'https://picsum.photos/seed/robotica/600/300', 4),
('Clube de Xadrez', 'Encontros semanais para prática e torneios de xadrez.', 'https://picsum.photos/seed/xadrez/600/300', 5),
('Clube de Cinema', 'Exibição e debate de filmes nacionais e internacionais.', NULL, NULL);

-- Membros de clube
INSERT INTO membros_clube (usuario_id, clube_id, status, data_entrada) VALUES
(1, 1, 'ATIVO', '2026-02-10'),
(2, 1, 'ATIVO', '2026-02-12'),
(3, 2, 'ATIVO', '2026-02-15'),
(6, 3, 'ATIVO', '2026-03-01'),
(2, 3, 'INATIVO', '2026-02-20');

-- Atividades
INSERT INTO atividades (clube_id, dia_semana, hora_inicio, hora_fim, local, ativo) VALUES
(1, 'TERCA', '14:00:00', '16:00:00', 'Laboratório de Robótica', TRUE),
(2, 'QUINTA', '15:30:00', '17:00:00', 'Sala 12', TRUE),
(3, 'SEXTA', '18:00:00', '20:00:00', 'Auditório', TRUE);

-- Solicitações
INSERT INTO solicitacoes (usuario_id, clube_id, tipo, status, mensagem) VALUES
(3, 1, 'INSCRICAO', 'PENDENTE', 'Gostaria de participar do Clube de Robótica.'),
(6, 2, 'INSCRICAO', 'APROVADA', 'Quero entrar no clube de xadrez.'),
(5, NULL, 'CRIACAO_CLUBE', 'PENDENTE', 'Gostaria de criar um Clube de Fotografia.');
