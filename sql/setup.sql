CREATE DATABASE dwii_db;
CREATE USER 'dwii_user'@'localhost' IDENTIFIED BY 'dwii2026';
GRANT ALL PRIVILEGES ON dwii_db.* TO 'dwii_user'@'localhost';
FLUSH PRIVILEGES;


CREATE TABLE projetos (
    id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome          VARCHAR(120) NOT NULL,
    descricao     TEXT NOT NULL,
    tecnologias   VARCHAR(200) NOT NULL,
    link_github   VARCHAR(300) NULL DEFAULT NULL,
    ano           YEAR NOT NULL,
    status        ENUM('rascunho','publicado','arquivado') NOT NULL DEFAULT 'rascunho',
    criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tecnologias (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome        VARCHAR(100) NOT NULL,
    categoria   VARCHAR(50) NOT NULL,
    descricao   TEXT,
    ano_criacao INT,
    status      ENUM('ativo','inativo') NOT NULL DEFAULT 'ativo',
    criado_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status) VALUES
('Portfolio Pessoal',            'Site de portfolio responsivo com PHP, PDO e MariaDB, painel admin e login.', 'PHP, MariaDB, CSS, Git',   'https://github.com/usuario/portfolio',  2026, 'publicado'),
('Sistema de Biblioteca',        'CRUD de acervo e emprestimos, com busca e relatorios.',                      'PHP, MariaDB, Bootstrap',  'https://github.com/usuario/biblioteca', 2025, 'publicado'),
('App de Tarefas',               'Lista de tarefas com categorias, prazos e filtro por status.',               'JavaScript, HTML, CSS',    'https://github.com/usuario/tarefas',    2025, 'publicado'),
('Loja Virtual (prototipo)',     'Catalogo de produtos com carrinho e checkout simulado.',                     'PHP, MariaDB, JavaScript', 'https://github.com/usuario/loja',       2024, 'publicado'),
('API de Clima',                 'Microsservico que consome uma API publica e devolve a previsao em JSON.',    'PHP, REST',                'https://github.com/usuario/clima',      2026, 'publicado'),
('Jogo da Velha (em construcao)','Jogo da velha local - ainda em desenvolvimento.',                            'JavaScript, HTML',         NULL,                                    2026, 'rascunho');

INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao) VALUES
('HTML',       'Frontend',       'Linguagem de marcacao para estrutura de paginas.', 1993),
('CSS',        'Frontend',       'Linguagem de estilos para apresentacao visual.',   1996),
('JavaScript', 'Frontend',       'Linguagem de programacao para o navegador.',       1995),
('PHP',        'Backend',        'Linguagem server-side para web dinamica.',         1994),
('MariaDB',    'Banco de Dados', 'SGBD relacional open-source.',                     2009),
('Git',        'DevOps',         'Sistema de controle de versao distribuido.',       2005);