# Portfólio Angular + API PHP

Projeto desenvolvido para a disciplina de Desenvolvimento Web II.

## Objetivo

Criar um portfólio pessoal para apresentar informações sobre mim, meus projetos e minhas habilidades na área de tecnologia, utilizando Angular no frontend e uma API desenvolvida em PHP com MariaDB no backend.

## Funcionalidades Implementadas

### Frontend (Angular)

* Criação das páginas Início, Sobre, Projetos, Catálogo e Contato
* Configuração do sistema de rotas utilizando Angular Router
* Implementação de barra de navegação
* Destaque visual da página ativa utilizando routerLinkActive
* Utilização de componentes Angular Material
* Exibição de conteúdo utilizando mat-card
* Página Início com apresentação pessoal
* Página Sobre com informações acadêmicas e profissionais
* Página Projetos consumindo API via service
* Página Catálogo consumindo API de tecnologias
* Página Contato - próximos passos
* Tratamento de estados de carregamento e lista vazia
* Uso de async pipe e @for para renderização das listas

### Backend (PHP + MariaDB)

* Conexão com banco de dados utilizando PDO
* API REST retornando dados em JSON
* Endpoint /api/projetos.php para listar projetos publicados
* Endpoint /api/tecnologias.php para listar tecnologias ativas
* Filtro de projetos por status
* Habilitação de CORS para integração com aplicações externas

## Tecnologias Utilizadas

Frontend: Angular, TypeScript, HTML, CSS, Angular Material  
Backend: PHP, MariaDB, PDO

## Estrutura do Banco de Dados

O script completo para criação do banco está em sql/setup.sql e cria banco dwii_db, usuário dwii_user, tabelas projetos e tecnologias com registros iniciais.

## Como Executar a API

1. Configurar banco de dados:
mysql -u root -p < sql/setup.sql

2. Executar servidor PHP:
/usr/bin/php -S localhost:8000

3. Testar endpoints:
Projetos: http://localhost:8000/api/projetos.php  
Tecnologias: http://localhost:8000/api/tecnologias.php

## Ambiente de Desenvolvimento

Node.js v24.14.0
npm 11.9.0
Angular CLI 21.2.13
PHP 8+
MariaDB

## Autoavaliação

Conceito pretendido: A

Justificativa:

Consumo da API (Projetos): projeto.service.ts (GET da API) + projetos.ts (async pipe com Observable)

Catálogo (Tecnologias): tecnologia.service.ts (GET da API) + catalogo.ts (async pipe e @for)

Botão Ver no GitHub: projetos.html com property binding [href] dentro de mat-card-actions

Boas práticas de arquitetura: serviços centralizam HTTP e componentes apenas exibem dados

Tratamento de estado: projetos.html e catalogo.html possuem estados de carregamento e mensagem quando não há dados

Uso de Angular moderno: uso de async pipe e @for para renderização reativa