<?php
// api/contato.php - recebe um contato via POST e grava no banco.
header('Access-Control-Allow-Origin: *'); // CORS (mesmo padrão da Aula 16)
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Preflight do navegador -> responde e sai.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {http_response_code(204); exit; }

// Só aceitamos POST aqui.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Use POST.']);
    exit;
}

// 1) Ler o CORPO cru (JSON) - NAO use $_POST: o Angular manda JSON.
$dados = json_decode(file_get_contents('php://input'), true);

// 2) Limpar espaços das pontas, com coalescencia nula (?? '')
$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$mensagem = trim($dados['mensagem'] ?? '');

// 3) Validar no SERVIDOR (nunca confie no front)
$erros = [];
if ($nome === '') $erros[] = 'O nome é obrigatorio.';
if ($email === '') $erros[] = 'O email é obrigatorio.';
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $erros[] = 'O e-mail e invalido.';
if (mb_strlen($mensagem) < 10) $erros[] = 'Mensagem com 10+ caracteres.';

if (!empty($erros)) {
    http_response_code(400); // Bad Request
    echo json_encode(['erros' => $erros]);
    exit;
}

// 4) Gravar com PREPARED STATEMENT (anti SQL Injection)
require __DIR__ . '/../conexao.php'; // fornece $pdo (Aula 16)
$sql = 'INSERT INTO contatos (nome, email, mensagem)
        VALUES (:nome, :email, :mensagem)';
$stmt = $pdo->prepare($sql);
$stmt->execute([':nome' => $nome, ':email' => $email, ':mensagem' => $mensagem]);

// 5) Responder 201 Created com id gerado
http_response_code(201);
echo json_encode([
    'sucesso' => true,
    'id' => (int) $pdo->lastInsertId(),
    'mensagem' => 'Contato recebido com sucesso!'
]);