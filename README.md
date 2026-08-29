# Portfólio Angular + API PHP

Projeto desenvolvido para a disciplina de Desenvolvimento Web II.

## Objetivo

Criar um portfólio pessoal para apresentar informações sobre mim, meus projetos e minhas habilidades na área de tecnologia, utilizando Angular no frontend e uma API desenvolvida em PHP com MariaDB no backend.

## Funcionalidades Implementadas

### Frontend (Angular)

* Criação das páginas Início, Sobre, Projetos, Catálogo e Contato.
* Configuração do sistema de rotas utilizando Angular Router.
* Implementação de barra de navegação.
* Destaque visual da página ativa utilizando `routerLinkActive`.
* Utilização de componentes Angular Material.
* Exibição de conteúdo utilizando `mat-card`.
* Página Início com apresentação pessoal.
* Página Sobre com informações acadêmicas e profissionais.
* Página Projetos consumindo API via projetos.
* Página Catálogo consumindo API de tecnologias.
* Página Contato consumindo API de contato.
* Página Gestão para listar, criar, editar e excluir projetos.
* Formulário de gestão com validação dos campos.
* Validação do nome do projeto com mínimo de 3 caracteres.
* Validação do ano do projeto.
* Seleção do status entre `rascunho` e `publicado`.
* Exibição do status de cada projeto em texto na lista.
* Status `publicado` exibido em verde e `rascunho` exibido em amarelo.
* Confirmação de exclusão utilizando `MatDialog`.
* Atualização automática da lista após adicionar ou editar um projeto, sem necessidade de atualizar a página.
* Retorno automático do formulário ao modo "Adicionar projeto" após salvar.
* Tratamento de estados de carregamento, lista vazia e erro.
* Uso de `async pipe` e `@for` para renderização das listas.
* Tratamento de erros da API com mensagens visíveis na tela.
* Botões desabilitados durante operações de salvamento para evitar requisições duplicadas.
* Layout responsivo para diferentes tamanhos de tela.
* Uso da tag `<meta name="viewport">` para adaptação da página a dispositivos móveis.
* Foco visível nos campos e elementos interativos durante a navegação por teclado.

### Backend (PHP + MariaDB)

* Conexão com banco de dados utilizando PDO.
* API REST retornando dados em JSON.
* Endpoint `/api/projetos.php`.
* Endpoint `/api/tecnologias.php`.
* Operações CRUD de projetos.
* GET para listar projetos publicados.
* GET com `?todos=1` para listar todos os projetos na área de gestão.
* POST para criar projetos.
* PUT para editar projetos.
* DELETE para excluir projetos.
* Filtro de projetos por status.
* Suporte aos status `rascunho`, `publicado` e `arquivado` no banco de dados.
* Validação do status recebido no POST e PUT.
* Uso de `prepare()` e `execute()` nas operações SQL de escrita.
* POST retorna HTTP 201 quando o projeto é criado.
* PUT retorna HTTP 200 quando a atualização é realizada.
* DELETE retorna HTTP 204 quando o projeto é excluído.
* Retorno HTTP 400 para requisições com dados obrigatórios ausentes ou inválidos.
* Retorno HTTP 404 quando o projeto informado não é encontrado.
* Retorno HTTP 405 quando o método HTTP não é permitido.
* Habilitação de CORS para integração com aplicações externas.
* Tratamento de requisições `OPTIONS` para o pré-voo do CORS.

## Tecnologias Utilizadas

Frontend: Angular, TypeScript, HTML, CSS, Angular Material.

Backend: PHP, MariaDB, PDO.

## Estrutura do Banco de Dados

O script completo para criação do banco está em `sql/setup.sql` e cria o banco `dwii_db`, o usuário `dwii_user` e as tabelas `projetos`,`tecnologias` e `contatos`.

## Como Executar a API

### 1. Configurar o banco de dados

```bash
mysql -u root -p < sql/setup.sql
```

### 2. Executar o servidor PHP

```bash
/usr/bin/php -S localhost:8000
```

### 3. Executar o Angular

Na pasta do projeto Angular:

```bash
ng serve
```

O endereço padrão utilizado pelo Angular é:

```text
http://localhost:4200
```

### 4. Testar os endpoints

Projetos:

```text
http://localhost:8000/api/projetos.php
```

Tecnologias:

```text
http://localhost:8000/api/tecnologias.php
```

### URL da API no Codespaces

A URL da API é definida no arquivo `projeto.service.ts`.

Quando o Codespace for recriado ou a porta pública mudar, é necessário atualizar a variável `url` do service para o novo endereço público da porta 8000.

A aplicação Angular continua utilizando o service para fazer as requisições. As URLs da API não são colocadas diretamente no `gestao.ts`.

## Ambiente de Desenvolvimento

* Node.js v24.14.0
* npm 11.9.0
* Angular CLI 21.2.13
* PHP 8+
* MariaDB

**Por que o mesmo endereço `api/projetos.php` consegue fazer quatro coisas diferentes?:**
O mesmo endereço `api/projetos.php` consegue realizar diferentes operações porque a API identifica o método HTTP usado na requisição. Assim, GET lista os projetos, POST cria, PUT altera e DELETE exclui.

**Antecipação de erro:** Se o botão for clicado duas vezes rapidamente, o estado `salvando` desabilita o botão após o primeiro clique, evitando que a tela envie outro POST enquanto a primeira requisição ainda está sendo processada. Assim, normalmente apenas um projeto é criado no banco.

**Comparação das estratégias:** Depois de salvar, uso `carregar()` para buscar novamente os projetos na API e atualizar a lista com os dados atuais do servidor. No excluir, uso `filter()` para remover diretamente o projeto do array local, evitando uma nova consulta à API.

### Erros previstos conferidos

#### 400 — POST sem nome

```text
HTTP/2 400
```

```json
{"erro":"Informe pelo menos o nome do projeto"}
```

#### 400 — PUT sem ID

```text
HTTP/2 400
```

```json
{"erro":"PUT exige o id na URL: ?id=NN"}
```

#### 404 — ID inexistente

```text
HTTP/2 404
```

```json
{"erro":"Projeto nao encontrado"}
```

#### 405 — Método não permitido

```text
HTTP/2 405
```

```json
{"erro":"Metodo nao permitido"}
```

### Polimento — confirmação com MatDialog

O `confirm()` nativo utilizado anteriormente foi substituído por um diálogo do Angular Material, onde foi consultada a própria documentação para implementação.

Ao clicar em "Excluir", é aberta uma janela contendo o nome do projeto e a confirmação da ação. O usuário pode escolher entre "Cancelar" e "Excluir".

Essa abordagem deixa a confirmação integrada ao visual da aplicação e evita a utilização do diálogo nativo do navegador.
Fonte consultada: documentação oficial do Angular Material — componente Dialog

### Pré-voo do CORS

Foi realizado o teste:

```bash
curl -i -X OPTIONS "https://SEU-ENDERECO-DO-8000.app.github.dev/api/projetos.php"
```

A API retornou:

```text
HTTP/2 204
```

e o cabeçalho:

```text
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

O navegador precisa dessa resposta antes do DELETE porque, em uma requisição que exige pré-voo CORS, ele verifica primeiro se o servidor permite a origem e o método que serão utilizados. Somente depois dessa confirmação a requisição principal pode ser enviada.

### Estratégias de atualização da lista

Depois de salvar, a aplicação utiliza `carregar()`, fazendo uma nova requisição ao servidor. Essa escolha garante que a lista seja reconstruída com os dados que realmente estão na API e no banco de dados.

No excluir, a aplicação utiliza `filter()` para remover o item do array local. Essa estratégia evita uma nova viagem à rede e atualiza a interface imediatamente.

A desvantagem é que o array local pode ficar desatualizado se os dados forem alterados por outra aba, outro usuário ou diretamente no banco.

### Objeção sobre o `(click)`

Um colega poderia sugerir usar um `<a href="...">` para excluir, mas isso faria uma requisição GET, enquanto a API foi criada para excluir utilizando o método DELETE. Além disso, o `(click)` permite abrir a confirmação antes de realizar a operação.

A evidência pode ser verificada com:

```bash
curl -i -X DELETE "https://SEU-ENDERECO-DO-8000.app.github.dev/api/projetos.php?id=ID"
```

Quando o projeto existe, a API responde com:

```text
HTTP/2 204
```

Isso demonstra que a exclusão foi implementada como DELETE e não como GET.

## Ficha de Diagnóstico

### O que estava errado?

Durante o desenvolvimento foram encontrados problemas principalmente na atualização da interface após as operações CRUD, no tratamento de erros da API e na exclusão dos projetos.

Também foi necessário adaptar a aplicação para trabalhar com os diferentes status dos projetos e diferenciar a listagem pública da listagem utilizada na gestão.

### O que foi corrigido?

Foi implementada a atualização automática da lista depois de adicionar ou editar um projeto.

O formulário passou a retornar ao modo "Adicionar projeto" depois do salvamento.

Foi adicionado o campo `status`, permitindo trabalhar com projetos em `rascunho` e `publicado`.

A gestão passou a buscar todos os projetos com `?todos=1`, enquanto a listagem pública continua mostrando apenas os publicados.

Foram adicionados tratamentos de erro visíveis na tela.

A confirmação de exclusão foi aprimorada utilizando `MatDialog`.

Também foram conferidos os códigos HTTP 400, 404, 405 e 204, além do pré-voo CORS com OPTIONS.

### O que foi decidido não corrigir?

Foi mantida a estratégia de remover o projeto excluído diretamente do array local, em vez de chamar novamente a API depois do DELETE.

Essa decisão foi mantida porque o item já foi confirmado como excluído pelo servidor e remover o elemento localmente evita uma requisição adicional. A possível desatualização da lista em caso de alterações externas foi considerada uma limitação aceitável para esta implementação.

## Puxando o que já era seu

* **Método:** `POST`
* **Status da resposta:** `201 Created`
* **Content-Type:** `application/json; charset=utf-8`
* **Explicação:** criar um projeto devolve `201` porque um novo recurso foi criado no servidor; já o DELETE devolve `204` porque o recurso foi excluído com sucesso e não há conteúdo para retornar no corpo da resposta.


## Autoavaliação

**Conceito pretendido: A**

R1: api/projetos.php — realiza GET, POST, PUT e DELETE, usando prepare() e execute(). Os erros 400, 404 e 405 foram testados com curl. O OPTIONS retorna 204 e permite os quatro verbos.
R2: portfolio-angular/src/app/gestao/gestao.ts e gestao.html — a tela lista, cria, edita e exclui projetos pelo ProjetoService, possui validações, status publicado/rascunho e mensagens de erro. A exclusão utiliza MatDialog.
R3: gestao.ts — após criar ou editar, carregar() atualiza a lista; após excluir, filter() remove o projeto diretamente, sem F5.
R4: README.md — explica por que o mesmo endpoint realiza quatro operações, registra o método, status e Content-Type vistos no Network e explica 201 para criação e 204 para exclusão. Também responde à objeção do <a href> com evidência do curl.
R5: portfolio-angular/src/index.html possui viewport; gestao.css possui responsividade; o README contém instruções de execução e a ficha de diagnóstico.