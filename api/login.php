<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://solid-waddle-696p4pwx799qf55r4-4200.app.github.dev');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'erro' => 'Metodo nao permitido'
    ]);
    exit;
}

try {

    $dados = json_decode(file_get_contents('php://input'), true);

    $usuario = $dados['usuario'] ?? '';
    $senha = $dados['senha'] ?? '';

    if ($usuario === 'admin' && $senha === '1234') {

        session_start();

        $_SESSION['logado'] = true;

        http_response_code(200);

        echo json_encode([
            'mensagem' => 'Login realizado com sucesso'
        ]);

        exit;
    }

    http_response_code(401);

    echo json_encode([
        'erro' => 'Usuario ou senha incorretos'
    ]);

    exit;

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'erro' => 'Falha no servidor'
    ]);

    exit;
}