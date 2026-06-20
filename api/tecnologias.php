<?php
//api/tecnologias.php - catalogo de tecnologias ATIVAS do Portfolio em JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require __DIR__ . '/../conexao.php';

$sql = "SELECT id, nome,categoria, descricao, ano_criacao
FROM tecnologias WHERE status = 'ativo' ORDER BY categoria, nome";
$tecnologias = $pdo->query($sql)->fetchAll();

echo json_encode($tecnologias);