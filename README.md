# Portfólio Angular + API PHP

Projeto desenvolvido para a disciplina de Desenvolvimento Web II.

## Objetivo

Criar um portfólio pessoal para apresentar informações sobre mim, meus projetos e minhas habilidades na área de tecnologia, utilizando Angular no frontend e uma API desenvolvida em PHP com MariaDB no backend.

## Funcionalidades Implementadas

### Frontend (Angular)

* Criação das páginas Início, Sobre, Projetos e Contato;
* Configuração do sistema de rotas utilizando Angular Router;
* Implementação de barra de navegação;
* Destaque visual da página ativa utilizando `routerLinkActive`;
* Utilização de componentes Angular Material;
* Exibição de conteúdo utilizando `mat-card`;
* Página Início com apresentação pessoal;
* Página Sobre com informações acadêmicas e profissionais;
* Estrutura inicial das páginas Projetos e Contato.

### Backend (PHP + MariaDB)

* Conexão com banco de dados utilizando PDO;
* API REST retornando dados em JSON;
* Endpoint `/api/projetos.php` para listar projetos publicados;
* Endpoint `/api/tecnologias.php` para listar tecnologias ativas;
* Filtro de projetos por status;
* Habilitação de CORS para integração com aplicações externas.

## Tecnologias Utilizadas

### Frontend

* Angular
* TypeScript
* HTML
* CSS
* Angular Material

### Backend

* PHP
* MariaDB
* PDO

## Estrutura do Banco de Dados

O script completo para criação do banco encontra-se em:

`sql/setup.sql`

O script cria:

* Banco de dados `dwii_db`;
* Usuário `dwii_user`;
* Tabela `projetos`;
* Tabela `tecnologias`;
* Registros iniciais para testes.

## Como Executar a API

### 1. Configurar o Banco de Dados

Execute o script:

```bash
mysql -u root -p < sql/setup.sql
```

### 2. Executar o Servidor PHP

```bash
/usr/bin/php -S localhost:8000
```

### 3. Testar os Endpoints

Projetos:

```text
http://localhost:8000/api/projetos.php
```

Tecnologias:

```text
http://localhost:8000/api/tecnologias.php
```

## Ambiente de Desenvolvimento

* Node.js: v24.14.0
* npm: 11.9.0
* Angular CLI: 21.2.13
* PHP 8+
* MariaDB
