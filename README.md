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

contato.html - linhas 6 a 17: validação visual do campo nome, email e mensagem, exibida somente quando o controle está inválido e foi tocado, com mensagem de texto e ícone de alerta, além  da associação entre label e campos por meio de for/id, garantindo identificação adequada dos campos.
contato.html - linhas 20 a 22: botão desabilitado enquanto o formulário está inválido ou durante o envio, além da exibição do estado "Enviando...".
contato.html - linhas 25 e 26: mensagens de sucesso e erro são apresentadas por texto, não dependendo somente de cores para transmitir informação.
contato.ts - linha 5: importação de HttpErrorResponse para tipar o tratamento dos erros HTTP.
contato.ts - linhas 24 a 36: método focarPrimeiroCampoInvalido() identifica o primeiro controle inválido e direciona o foco para seu elemento correspondente.
contato.ts - linhas 38 a 44: formulário inválido é marcado como tocado e o primeiro campo inválido recebe foco antes do envio.
contato.ts - linhas 52 a 59: error recebe HttpErrorResponse, verifica respostas HTTP 400 e aproveita os erros retornados pelo backend por meio de err.error?.erros. E o estado enviando é redefinido para false, permitindo que o botão seja utilizado novamente após um erro.
api/contato.php - linhas 27 a 31:backend realiza validação dos dados recebidos e armazena os erros em um array.
api/contato.php - linhas 33 a 37: quando existem erros de validação, a API retorna HTTP 400 com os erros no formato { "erros": [...] }, permitindo que o Angular aproveite essas mensagens.
api/contato.php - linhas 40 a 44: dados válidos são gravados no banco utilizando prepared statement.
api/contato.php - linhas 47 a 52: API retorna HTTP 201 e uma resposta JSON contendo sucesso, id e mensagem de confirmação.