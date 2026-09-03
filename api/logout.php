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

session_start();

$_SESSION = [];

session_destroy();

echo json_encode([
    'mensagem' => 'Logout realizado com sucesso'
]);