<?php
// conexão.php - conexão PDO com MariaDB (reutilizavel)
$host = 'localhost';
$db = 'dwii_db';
$user = 'dwii_user';
$pass = 'dwii2026';
$charset = 'utf8mb4';

// host 'localhost' conecta pelo socket locsl (casa com o usuário @'localhost')
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$opcoes = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

$pdo = new PDO($dsn, $user, $pass, $opcoes);