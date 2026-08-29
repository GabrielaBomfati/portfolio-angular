<?php 
// api/projetos.php - le, cria. altera e apaga projetos (CRUD completo) 
 
header('Content-Type: application/json; charset=utf-8'); 
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS'); 
header('Access-Control-Allow-Headers: Content-Type'); 
 
// Qualquer erro de PHP ou de banco vira JSON com status 500. 
// Sem isso, um tropeço no banco devolve tela em branco e você fica sem pista. 
set_exception_handler(function ($e) { 
    http_response_code(500); 
    echo json_encode([ 
        'erro' => 'Falha no servidor: ' . $e->getMessage() 
    ]); 
}); 
 
// Antes de um POST/PUT/DELETE o navegador pergunta "posso?" com um OPTIONS. 
// Responda 204 (ok, sem corpo) e saia - isto é o "pré-voo" do CORS. 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    http_response_code(204); 
    exit; 
} 
 
try { 
 
    require __DIR__ . '/../conexao.php'; 
 
    $metodo = $_SERVER['REQUEST_METHOD']; 
 
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0; 
 
    if ($metodo === 'GET') {

    $todos = isset($_GET['todos']) && $_GET['todos'] === '1';

    if ($todos) {
        $sql = "SELECT id, nome, descricao, tecnologias, link_github, ano, status
                FROM projetos";
    } else {
        $sql = "SELECT id, nome, descricao, tecnologias, link_github, ano, status
                FROM projetos
                WHERE status = 'publicado'";
    }

    $projetos = $pdo->query($sql)->fetchAll();

    echo json_encode($projetos);

    exit;
}
 
    if ($metodo === 'POST') { 
        // POST cria: os dados vêm do corpo, em JSON, e o id nasce no banco. 
        $dados = json_decode(file_get_contents('php://input'), true); 
 
        if (!$dados || empty($dados['nome'])) { 
            http_response_code(400); 
            echo json_encode([ 
                'erro' => 'Informe pelo menos o nome do projeto' 
            ]); 
            exit; 
        } 
 
        if (!isset($dados['status']) || !in_array($dados['status'], ['rascunho', 'publicado'])) { 
            http_response_code(400); 
            echo json_encode([ 
                'erro' => 'Status deve ser rascunho ou publicado' 
            ]); 
            exit; 
        } 
 
        $sql = 'INSERT INTO projetos 
                (nome, descricao, tecnologias, link_github, ano, status) 
                VALUES (?, ?, ?, ?, ?, ?)'; 
 
        $stmt = $pdo->prepare($sql); 
 
        $stmt->execute([ 
            $dados['nome'], 
            $dados['descricao'] ?? '', 
            $dados['tecnologias'] ?? '', 
            $dados['link_github'] ?? '', 
            $dados['ano'] ?? date('Y'), 
            $dados['status'] 
        ]); 
 
        http_response_code(201); 
 
        echo json_encode([ 
            'id' => (int) $pdo->lastInsertId() 
        ]); 
 
        exit; 
    } 
 
    if ($metodo === 'PUT') { 
        // PUT altera: precisa do id na URL (qual) E do corpo (o que gravar). 
 
        if ($id <= 0) { 
            http_response_code(400); 
            echo json_encode([ 
                'erro' => 'PUT exige o id na URL: ?id=NN' 
            ]); 
            exit; 
        } 
 
        $dados = json_decode(file_get_contents('php://input'), true); 
 
        if (!$dados || empty($dados['nome'])) { 
            http_response_code(400); 
            echo json_encode([ 
                'erro' => 'Informe pelo menos o nome do projeto' 
            ]); 
            exit; 
        } 
 
        if (!isset($dados['status']) || !in_array($dados['status'], ['rascunho', 'publicado'])) { 
            http_response_code(400); 
            echo json_encode([ 
                'erro' => 'Status deve ser rascunho ou publicado' 
            ]); 
            exit; 
        } 
 
        $sql = 'UPDATE projetos 
                SET nome = ?, descricao = ?, tecnologias = ?, 
                    link_github = ?, ano = ?, status = ? 
                WHERE id = ?'; 
 
        $stmt = $pdo->prepare($sql); 
 
        $stmt->execute([ 
            $dados['nome'], 
            $dados['descricao'] ?? '', 
            $dados['tecnologias'] ?? '', 
            $dados['link_github'] ?? '', 
            $dados['ano'] ?? date('Y'), 
            $dados['status'], 
            $id 
        ]); 
 
        if ($stmt->rowCount() === 0) { 
            http_response_code(404); 
            echo json_encode([ 
                'erro' => 'Projeto nao encontrado' 
            ]); 
            exit; 
        } 
 
        echo json_encode([ 
            'mensagem' => 'Projeto atualizado com sucesso' 
        ]); 
 
        exit; 
    } 
 
    if ($metodo === 'DELETE') { 
        // DELETE apaga: precisa do id na URL. 
        if ($id <= 0) { 
            http_response_code(400); 
            echo json_encode([ 
                'erro' => 'DELETE exige o id na URL: ?id=NN' 
            ]); 
            exit; 
        } 
 
        $sql = 'DELETE FROM projetos WHERE id = ?'; 
 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute([$id]); 
 
        if ($stmt->rowCount() === 0) { 
            http_response_code(404); 
            echo json_encode([ 
                'erro' => 'Projeto nao encontrado' 
            ]); 
            exit; 
        } 
 
        http_response_code(204); 
        exit; 
    } 
 
    http_response_code(405); 
 
    echo json_encode([ 
        'erro' => 'Metodo nao permitido' 
    ]); 
 
} catch (Exception $e) { 
 
    http_response_code(500); 
 
    echo json_encode([ 
        'erro' => 'Falha ao acessar o banco de dados' 
    ]); 
} 
