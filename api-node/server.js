// api-node/server.js - a API do portfolio em Node (Aula 21)
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORTA = 3000;
// Deixa outrra origem (o Angular na porta 4200) chamar esta API
app.use(cors({
    origin: 'https://solid-waddle-696p4pwx799qf55r4-4200.app.github.dev',
    credentials: true
}));
// Le o corpo JSON de POST e PUT e entrega em req.body. Sm isto, req.body e undefined.
app.use(express.json());

 // O mesmo SELECT do api/projetos.php: so os publicado, do mais novo ao mais antigo
app.get('/api/projetos', async (req, res) => {
    try {
        let sql;

        if (req.query.todos === '1') {
            // Gestão: busca todos os projetos, inclusive rascunhos
            sql = `SELECT id, nome, descricao, tecnologias, link_github, ano, status
                   FROM projetos
                   ORDER BY ano DESC, id`;
        } else {
            // Portfólio público: somente projetos publicados
            sql = `SELECT id, nome, descricao, tecnologias, link_github, ano, status
                   FROM projetos
                   WHERE status = 'publicado'
                   ORDER BY ano DESC, id`;
        }

        const [projetos] = await pool.query(sql);
        res.status(200).json(projetos);
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

// Um projeto pelo id. O ? e o mesmo  do prepare do PHP: o valor nunca entra na string. 
app.get('/api/projetos/:id', async (req, res) => {
    try {
    const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE id = ? AND status = 'publicado'";
    const [linhas] = await pool.execute(sql, [req.params.id]);
    if (linhas.length === 0) {
        return res.status(404).json({ erro: 'Projeto nao encontrado'});
    }
    res.json(linhas[0]);
} catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message});
}
});

// POST cria: os dados vem do corpo, em JSON, e o id nasce no banco

// POST cria: os dados vem do corpo, em JSON, e o id nasce no banco
app.post('/api/projetos', async (req, res) => {
    try {
        const dados = req.body;

        if (!dados || !dados.nome || !dados.nome.trim()) {
            return res.status(400).json({
                erro: 'Informe pelo menos o nome do projeto'
            });
        }

        // Se o formulario enviar rascunho, salva como rascunho.
        // Se nao enviar status, usa publicado como padrao.
        const status = dados.status ?? 'publicado';

        if (!['rascunho', 'publicado'].includes(status)) {
            return res.status(400).json({ erro: 'Status invalido' });
        }

        const sql = 'INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status) VALUES (?, ?, ?, ?, ?, ?)';

        const [resultado] = await pool.execute(sql, [
            dados.nome.trim(),
            dados.descricao ?? '',
            dados.tecnologias ?? '',
            dados.link_github ?? '',
            dados.ano ?? new Date().getFullYear(),
            status
        ]);

        res.status(201).json({ id: resultado.insertId });
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});


// PUT altera: o di vem no caminho (qual projeto) e os dados no corpo( o que gravar).

// PUT altera: o id vem no caminho (qual projeto) e os dados no corpo (o que gravar).
app.put('/api/projetos/:id', async (req, res) => {
    try {
        const dados = req.body;

        if (!dados || !dados.nome || !dados.nome.trim()) {
            return res.status(400).json({
                erro: 'Informe pelo menos o nome do projeto'
            });
        }

        // Atualiza tambem o status escolhido no formulario
        const status = dados.status ?? 'publicado';

        if (!['rascunho', 'publicado'].includes(status)) {
            return res.status(400).json({ erro: 'Status invalido' });
        }

        const sql = `
            UPDATE projetos
            SET nome = ?, descricao = ?, tecnologias = ?,
                link_github = ?, ano = ?, status = ?
            WHERE id = ?
        `;

        const [resultado] = await pool.execute(sql, [
            dados.nome.trim(),
            dados.descricao ?? '',
            dados.tecnologias ?? '',
            dados.link_github ?? '',
            dados.ano ?? new Date().getFullYear(),
            status,
            req.params.id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Projeto nao encontrado' });
        }

        res.status(200).json({ mensagem: 'Projeto atualizado.' });
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});


// DELETE apaga: so precisa do id. Nao ha corpo no pedido, e a resposta também nao tem.
app.delete('/api/projetos/:id', async (req, res) => {
    try{
        const [resultado] = await pool.execute('DELETE FROM projetos WHERE id = ?', [req.params.id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({erro: 'Projeto nao encontrado'});
        }
        res.status(204).end();
    } catch (erro) {
        res.status(500).json({erro: 'Falha no servidor: ' + erro.mensage});
    }
});

// O catalogo, com o SELECT do api/tecnologias.php
app.get('/api/tecnologias', async (req, res) => {
    try{
    const sql = "SELECT id, nome, categoria, descricao, ano_criacao FROM tecnologias WHERE status = 'ativo' ORDER BY categoria, nome";
    const [tecnologias] = await pool.query(sql);
    res.json(tecnologias);
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message});
    }
});
app.listen(PORTA, () => {
    console.log('API no ar em http://localhost:' + PORTA);
});