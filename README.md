# Portfólio Angular + APIs PHP e Node.js

> **Desenvolvimento Web II | 2026**  
> Frontend Angular • API Node.js/Express • Banco de dados MariaDB

## Sobre o projeto

Portfólio responsivo para apresentar informações pessoais, projetos e tecnologias. No segundo trimestre, a integração com o banco foi feita por uma API PHP/PDO. Nas Aulas 21 a 24, o backend evoluiu para Node.js/Express com MariaDB, operações CRUD e autenticação JWT.

**API atual:** `http://localhost:3000` • **Frontend:** porta `4200` • **API PHP:** mantida como histórico.

## Tecnologias

| Camada | Ferramentas |
|---|---|
| Frontend | Angular, TypeScript, HTML, CSS e Angular Material |
| Backend atual | Node.js, Express, mysql2, bcryptjs, jsonwebtoken e cors |
| Backend histórico | PHP e PDO |
| Banco de dados | MariaDB |
| Desenvolvimento | GitHub Codespaces, Git e npm |

Ambiente utilizado: Node.js v24.14.0, npm 11.9.0 e Angular CLI 21.2.13.

## Funcionalidades

**Angular:** páginas Início, Sobre, Projetos, Catálogo e Contato; navegação com Angular Router; cartões Material; tela de Gestão com cadastro, edição, exclusão, validação de formulários, mensagens de erro, carregamento e confirmação de exclusão com `MatDialog`.

**API Node.js:** consulta de projetos e tecnologias; criação, edição e exclusão de projetos e tecnologias; login com senha armazenada como hash bcrypt; emissão de JWT; proteção das operações de escrita e da leitura de rascunhos; consultas SQL parametrizadas e erros em JSON.

> **Atenção à integração:** a rota antiga `GET /api/projetos?todos=1` não libera mais os rascunhos. A tela de Gestão do Angular deve consultar `GET /api/projetos/todos` com o cabeçalho `Authorization: Bearer <token>` para carregar também os rascunhos. A API foi testada; A integração do Angular com a autenticação JWT foi testada com sucesso, incluindo login, listagem de projetos, cadastro, edição, exclusão e logout.

---

## Resumo do 2º trimestre — API PHP

Foi desenvolvida uma API REST com PHP, PDO e MariaDB, utilizando `api/projetos.php` e `api/tecnologias.php`. O trabalho incluiu GET, POST, PUT e DELETE, validação, filtragem de projetos publicados, integração com a Gestão Angular, CORS, respostas HTTP e atualização da interface após alterações. O `MatDialog` substituiu a confirmação nativa de exclusão.

O script `sql/setup.sql` prepara o banco `dwii_db` e suas tabelas. Os arquivos PHP foram preservados como registro da implementação anterior.

Para executar a API histórica, a partir da raiz do repositório:

```bash
sudo service mariadb start
mysql -u root -p < sql/setup.sql
/usr/bin/php -S localhost:8000
```

Endpoints históricos: `http://localhost:8000/api/projetos.php` e `http://localhost:8000/api/tecnologias.php`.

## Aula 21 — API em Node.js

Criação da pasta `api-node/`, instalação do Express e primeira rota `GET /api/projetos`, inicialmente alimentada por uma lista fixa.

```bash
cd api-node
npm install
node server.js
```

**Comando de verificação:**

```bash
curl -i http://localhost:3000/api/projetos
```

## Aula 22 — Consultas ao MariaDB

A API passou a usar `mysql2` para buscar projetos e tecnologias diretamente do banco `dwii_db`, em vez de depender de dados fixos.

```bash
sudo service mariadb start
cd api-node
node server.js
```

**Consultas:**

```bash
curl -i http://localhost:3000/api/projetos
curl -i http://localhost:3000/api/projetos/1
curl -i http://localhost:3000/api/tecnologias
```

## Aula 23 — CRUD de projetos

Implementação de POST, PUT e DELETE com SQL parametrizado. Respostas de sucesso: `201 Created` para inclusão, `200 OK` para edição e `204 No Content` para exclusão. A partir da Aula 24, as três operações passaram a exigir JWT.

## Aula 24 — Autenticação JWT e níveis C, B e A

### Nível C — CRUD e autenticação

A tabela `usuarios` armazena o e-mail do proprietário e o hash bcrypt da senha. `POST /api/login` valida as credenciais e emite um JWT. O middleware único `autenticar` verifica o token antes das rotas protegidas. A API utiliza respostas JSON e consultas parametrizadas.

### Nível B — Segurança personalizada e CRUD do catálogo

- O proprietário utiliza seu próprio e-mail e uma senha particular, não publicados no repositório.
- O JWT expira em **1 hora**, em vez de 2 horas: esse período permite utilizar a Gestão e reduz a janela de risco se o token for comprometido.
- A ausência de token retorna `401` com `Acesso negado. Faca login para continuar.`
- Um token inválido ou expirado retorna `401` com `Sua sessao expirou ou o token e invalido. Entre novamente.`
- O login devolve a mesma mensagem para e-mail inexistente e senha incorreta, evitando revelar quais endereços estão cadastrados.
- POST, PUT e DELETE de `/api/tecnologias` também utilizam `autenticar`.

### Nível A — Leitura protegida de rascunhos

- `GET /api/projetos` é público e devolve apenas projetos com `status = 'publicado'`.
- `GET /api/projetos/todos` exige JWT e devolve publicados **e** rascunhos.
- A rota `/api/projetos/todos` fica **antes** de `/api/projetos/:id` para que o Express não interprete `todos` como um ID.
- O middleware `autenticar` é reutilizado, sem copiar `jwt.verify` para dentro das rotas.
- O parâmetro antigo `?todos=1` não contorna a autenticação: na rota pública, continua retornando apenas publicados.

### Por que o `SEGREDO` não pode ficar no código em produção?

O `SEGREDO` assina os tokens JWT: se for exposto, terceiros podem falsificar tokens válidos. Mantê-lo no `server.js` e versioná-lo no Git aumenta esse risco. Na **Aula 29**, a configuração deve ser migrada para variável de ambiente, sem publicar o valor no repositório. O segredo atual deverá ser substituído antes de uma implantação real.

### Tabela de rotas

| Rota | Verbo | Precisa de token? | Finalidade |
|---|---|---|---|
| `/api/login` | POST | Não | Autenticar o proprietário |
| `/api/projetos` | GET | Não | Listar somente publicados |
| `/api/projetos/todos` | GET | **Sim** | Listar publicados e rascunhos |
| `/api/projetos/:id` | GET | Não | Consultar projeto por ID |
| `/api/projetos` | POST | **Sim** | Criar projeto |
| `/api/projetos/:id` | PUT | **Sim** | Editar projeto |
| `/api/projetos/:id` | DELETE | **Sim** | Excluir projeto |
| `/api/tecnologias` | GET | Não | Listar tecnologias |
| `/api/tecnologias` | POST | **Sim** | Criar tecnologia |
| `/api/tecnologias/:id` | PUT | **Sim** | Editar tecnologia |
| `/api/tecnologias/:id` | DELETE | **Sim** | Excluir tecnologia |

---

## Como executar do zero

Execute os comandos a partir da raiz do repositório, exceto quando outra pasta for indicada.

### 1. Preparar o banco — primeira instalação

```bash
sudo service mariadb start
mysql -u root -p < sql/setup.sql
sudo mariadb dwii_db < sql/usuarios.sql
```

> Os scripts de instalação não devem ser executados novamente sobre um banco com dados sem antes verificar seus efeitos.

### 2. Instalar dependências da API

```bash
cd api-node
npm install
```

### 3. Cadastrar o proprietário — uma única vez

A criação inicial usa `api-node/criar-usuario.js`. Informe um e-mail próprio e uma senha forte, sem gravar a senha em arquivos ou no histórico de comandos. Se o proprietário já estiver cadastrado, não repita o cadastro.

```bash
node criar-usuario.js <seu-email> '<senha>'
```

> Os valores acima são **placeholders**, não credenciais reais. Esse formato segue o comando documentado na etapa inicial; confira os argumentos aceitos pelo seu `criar-usuario.js` antes de executar. Para não registrar a senha no histórico do terminal, prefira uma versão do script que solicite a senha de forma oculta. O cadastro já existente não deve ser repetido.

### 4. Iniciar o backend

```bash
node server.js
```

Mantenha o terminal aberto. A API responde em `http://localhost:3000`.

### 5. Iniciar o frontend em outro terminal

Na raiz do repositório:

```bash
npm install
ng serve
```

O Angular utiliza normalmente a porta `4200`. No Codespaces, confira a visibilidade das portas e a URL da API configurada no serviço Angular.

### 6. Obter o token com segurança no terminal de testes

```bash
read -rp 'Digite seu email: ' EMAIL
read -rsp 'Digite sua senha: ' SENHA; echo
TOKEN=$(EMAIL="$EMAIL" SENHA="$SENHA" node -e '
process.stdout.write(JSON.stringify({
  email: process.env.EMAIL,
  senha: process.env.SENHA
}));
' | curl -s -X POST http://localhost:3000/api/login \
  -H 'Content-Type: application/json' \
  -d @- | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).token")
unset SENHA
```

O token fica apenas na variável `$TOKEN` do terminal atual. Faça login novamente após 1 hora ou se o terminal for reiniciado. **Não publique a senha, o JWT ou o `SEGREDO`.**

---

## Testes com `curl` — comandos e respostas

**Convenções:** os testes de 22/10/2026 são identificados como Nível C; os de 24/10/2026, como Níveis B e A. Foram removidos cabeçalhos transitórios (`Date`, `ETag`, CORS etc.). Onde o terminal forneceu arrays extensos, os exemplos abaixo mostram **trechos identificados**, não um JSON completo. Os IDs 34, 35 e 7 são registros de teste daquela execução e podem mudar.

### Nível C — Leitura, escrita e erros

#### C1. GET — Projetos publicados

**Comando:**

```bash
curl -i http://localhost:3000/api/projetos
```

**Resposta registrada:** array com sete projetos publicados, IDs `1, 3, 5, 16, 21, 2, 4`. O cabeçalho HTTP original desse teste não foi preservado; a confirmação posterior no Nível B foi `200 OK`.

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":1,"nome":"Portfolio Pessoal","status":"publicado"}, ...]
```

*O corpo acima é um trecho ilustrativo dos registros reais; as demais propriedades foram omitidas.*

#### C2. GET — Projeto por ID

**Comando:**

```bash
curl -i http://localhost:3000/api/projetos/1
```

**Resposta:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id":1,"nome":"Portfolio Pessoal","descricao":"Site de portfolio responsivo com PHP, PDO e MariaDB, painel admin e login.","tecnologias":"PHP, MariaDB, CSS, Git","link_github":"https://github.com/usuario/portfolio","ano":2026}
```

#### C3. GET — Tecnologias

**Comando:**

```bash
curl -i http://localhost:3000/api/tecnologias
```

**Resposta:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":4,"nome":"PHP","categoria":"Backend","descricao":"Linguagem server-side para web dinamica.","ano_criacao":1994},{"id":5,"nome":"MariaDB","categoria":"Banco de Dados","descricao":"SGBD relacional open-source.","ano_criacao":2009},{"id":6,"nome":"Git","categoria":"DevOps","descricao":"Sistema de controle de versao distribuido.","ano_criacao":2005},{"id":2,"nome":"CSS","categoria":"Frontend","descricao":"Linguagem de estilos para apresentacao visual.","ano_criacao":1996},{"id":1,"nome":"HTML","categoria":"Frontend","descricao":"Linguagem de marcacao para estrutura de paginas.","ano_criacao":1993},{"id":3,"nome":"JavaScript","categoria":"Frontend","descricao":"Linguagem de programacao para o navegador.","ano_criacao":1995}]
```

#### C4. POST — Login correto

**Comando:**

```bash
curl -i -X POST http://localhost:3000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"<seu-email>","senha":"<senha>"}'
```

**Resposta (token ocultado):**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"token":"<token-ocultado>"}
```

*Substitua os valores entre `< >` antes de executar; prefira a captura segura de token apresentada anteriormente.*

#### C5. POST — Criar projeto com token

**Comando:**

```bash
curl -i -X POST http://localhost:3000/api/projetos \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Projeto Teste Aula 24","ano":2026,"status":"publicado"}'
```

**Resposta:**

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":34}
```

#### C6. PUT — Editar projeto com token

**Comando:**

```bash
curl -i -X PUT http://localhost:3000/api/projetos/34 \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Projeto Teste Aula 24 (editado)","ano":2026,"status":"publicado"}'
```

**Resposta:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"mensagem":"Projeto atualizado."}
```

#### C7. DELETE — Excluir projeto com token

**Comando:**

```bash
curl -i -X DELETE http://localhost:3000/api/projetos/34 \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta:**

```http
HTTP/1.1 204 No Content
```

*O status 204 não possui corpo JSON.*

#### C8. GET — ID inexistente

**Comando:**

```bash
curl -i http://localhost:3000/api/projetos/999999
```

**Resposta:**

```http
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{"erro":"Projeto nao encontrado"}
```

#### C9. POST — Nome vazio

**Comando:**

```bash
curl -i -X POST http://localhost:3000/api/projetos \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"nome":"","ano":2026}'
```

**Resposta:**

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"erro":"Informe pelo menos o nome do projeto"}
```

#### C10. PATCH — Método não permitido

**Comando:**

```bash
curl -i -X PATCH http://localhost:3000/api/projetos/1
```

**Resposta após a correção:**

```http
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json; charset=utf-8

{"erro":"Metodo nao permitido"}
```

*Antes da correção, esse teste retornava 404 em HTML. O tratamento foi ajustado para 405 em JSON.*

### Nível B — Sete testes da tranca

#### B1. POST — Login correto

**Comando:**

```bash
curl -i -X POST http://localhost:3000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"<seu-email>","senha":"<senha>"}'
```

**Resposta (token ocultado):**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"token":"<token-ocultado>"}
```

#### B2. POST — Login com senha incorreta

**Comando:**

```bash
curl -i -X POST http://localhost:3000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"<seu-email>","senha":"senha-incorreta-de-teste"}'
```

**Resposta:**

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{"erro":"Nao foi possivel entrar. Confira seu email e sua senha."}
```

*O mesmo texto é usado quando o e-mail não existe, para não revelar quais contas estão cadastradas.*

#### B3. POST — Projeto sem token

**Comando:**

```bash
curl -i -X POST http://localhost:3000/api/projetos \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Teste sem autenticacao","ano":2026}'
```

**Resposta:**

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{"erro":"Acesso negado. Faca login para continuar."}
```

#### B4. POST — Projeto com token

**Comando:**

```bash
curl -i -X POST http://localhost:3000/api/projetos \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Projeto Teste Nivel B","ano":2026,"status":"publicado"}'
```

**Resposta:**

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":35}
```

#### B5. PUT — Projeto com token

**Comando:**

```bash
curl -i -X PUT http://localhost:3000/api/projetos/35 \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Projeto Teste Nivel B (editado)","ano":2026,"status":"publicado"}'
```

**Resposta:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"mensagem":"Projeto atualizado."}
```

#### B6. DELETE — Sem token

**Comando realmente testado (catálogo):**

```bash
curl -i -X DELETE http://localhost:3000/api/tecnologias/7
```

**Resposta:**

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{"erro":"Acesso negado. Faca login para continuar."}
```

*Esse teste confirma a proteção do DELETE de tecnologias. Para demonstrar também o DELETE de projetos sem token, executar `curl -i -X DELETE http://localhost:3000/api/projetos/1` (o esperado é 401; esse comando ainda não foi documentado como resultado observado).*

#### B7. GET — Projetos públicos sem token

**Comando:**

```bash
curl -i http://localhost:3000/api/projetos
```

**Resposta:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":1,"nome":"Portfolio Pessoal","status":"publicado"}, ...]
```

*Trecho dos sete projetos publicados; o GET público não exige JWT.*

### Nível B — CRUD protegido de tecnologias

#### B8. POST — Tecnologia sem token

**Comando:**

```bash
curl -i -X POST http://localhost:3000/api/tecnologias \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Tecnologia Teste B","categoria":"Frontend","descricao":"Teste de autenticacao","ano_criacao":2026}'
```

**Resposta:**

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{"erro":"Acesso negado. Faca login para continuar."}
```

#### B9. POST — Criar tecnologia com token

**Comando:**

```bash
curl -i -X POST http://localhost:3000/api/tecnologias \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Tecnologia Teste B","categoria":"Frontend","descricao":"Teste de autenticacao do Nivel B","ano_criacao":2026}'
```

**Resposta:**

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":7}
```

#### B10. PUT — Atualizar tecnologia com token

**Comando:**

```bash
curl -i -X PUT http://localhost:3000/api/tecnologias/7 \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Tecnologia Teste B (editada)","categoria":"Frontend","descricao":"Tecnologia atualizada no Nivel B","ano_criacao":2026}'
```

**Resposta:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"mensagem":"Tecnologia atualizada com sucesso."}
```

#### B11. DELETE — Tecnologia com token

**Comando:**

```bash
curl -i -X DELETE http://localhost:3000/api/tecnologias/7 \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta:**

```http
HTTP/1.1 204 No Content
```

### Nível A — Acesso público versus rascunhos protegidos

#### A1. GET — Todos os projetos sem token

**Comando:**

```bash
curl -i http://localhost:3000/api/projetos/todos
```

**Resposta:**

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{"erro":"Acesso negado. Faca login para continuar."}
```

#### A2. GET — Todos os projetos com token

**Comando:**

```bash
curl -i http://localhost:3000/api/projetos/todos \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta (trecho dos dados reais):**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":1,"nome":"Portfolio Pessoal","status":"publicado"},
 {"id":6,"nome":"Jogo da Velha (em construcao)","status":"rascunho"}, ...]
```

*O array real contém outros campos e projetos. O ID 6 comprova a presença de um rascunho na consulta autenticada.*

#### A3. GET — Tentativa de acessar rascunhos pelo parâmetro antigo

**Comando:**

```bash
curl -i 'http://localhost:3000/api/projetos?todos=1'
```

**Resposta (trecho dos dados reais):**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":1,"nome":"Portfolio Pessoal","status":"publicado"},
 {"id":3,"nome":"Projeto com tranca (editado)","status":"publicado"}, ...]
```

*Foram retornados apenas os sete publicados; o rascunho ID 6 não apareceu.*

---

## Códigos HTTP

| Código | Uso na API |
|---|---|
| `200 OK` | Consulta, login ou edição bem-sucedida |
| `201 Created` | Criação de projeto ou tecnologia |
| `204 No Content` | Exclusão sem corpo de resposta |
| `400 Bad Request` | Dados inválidos ou obrigatórios ausentes |
| `401 Unauthorized` | Falta de autenticação, credenciais incorretas ou token inválido |
| `404 Not Found` | Registro não encontrado |
| `405 Method Not Allowed` | Método HTTP não permitido |

## O que esta API ainda não faz

1. **Revogação antecipada de tokens:** não há logout que invalide imediatamente um JWT já emitido; ele continua válido até expirar, salvo mudança do segredo de assinatura.
2. **Recuperação de senha:** a API não oferece um fluxo de redefinição de senha por e-mail ou token de recuperação.

## Cuidados de segurança

- Nunca armazenar senhas em texto puro no banco: usar hash bcrypt.
- Nunca versionar senhas pessoais, tokens JWT ou segredos de assinatura.
- O cabeçalho de autenticação é `Authorization: Bearer <token>`.
- O usuário proprietário é cadastrado apenas uma vez; o e-mail é único.
- No Codespaces, conferir as URLs e a visibilidade das portas a cada ambiente.

## Histórico de commits

> Mensagens previstas para o histórico da atividade; conferir os textos exatos dos commits já realizados com `git log --oneline`. **Não executar o commit da Aula 24 antes de concluir as verificações finais.**

- Aula 21: Criar API Node.js com Express.
- Aula 22: Integrar API Node.js ao MariaDB.
- Aula 23: Implementar CRUD de projetos.
- Aula 24: Adicionar autenticação JWT, CRUD protegido e leitura de rascunhos.