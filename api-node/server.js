// api-node/server.js - a API do portfolio em Node (Aula 21)
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const PORTA = 3000;
// A chave que assina os tokens. Fica aqui ao ate a aula 29.
const SEGREDO = 'piso-na-cara-do-inimigo-de-bota-preta-cano-alto-com-salto-fino.';
// Deixa outrra origem (o Angular na porta 4200) chamar esta API
app.use(cors({
    origin: 'https://solid-waddle-696p4pwx799qf55r4-4200.app.github.dev',
    credentials: true
}));
// Le o corpo JSON de POST e PUT e entrega em req.body. Sm isto, req.body e undefined.
app.use(express.json());
// Middleware: confere o token antes de a rota rodar. Entra so nas rotas que o pedem.
function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization ?? '';
    const token = cabecalho.startsWith('Bearer ')
        ? cabecalho.slice(7)
        : '';
    if (!token) {
        return res.status(401).json({
            erro: 'Acesso negado. Faca login para continuar.'
        });
    }
    try {
        req.usuario = jwt.verify(token, SEGREDO);
        next();
    } catch (erro) {
        return res.status(401).json({
            erro: 'Sua sessao expirou ou o token e invalido. Entre novamente.'
        });
    }
}

 // GET protegido: lista todos os projetos, inclusive rascunhos
app.get('/api/projetos/todos', autenticar, async (req, res) => {
    try {
        const sql = `
            SELECT id, nome, descricao, tecnologias,
                   link_github, ano, status
            FROM projetos
            ORDER BY ano DESC, id
        `;

        const [projetos] = await pool.query(sql);

        return res.status(200).json(projetos);
    } catch (erro) {
        return res.status(500).json({
            erro: 'Falha no servidor: ' + erro.message
        });
    }
});


 // O mesmo SELECT do api/projetos.php: so os publicado, do mais novo ao mais antigo

 // GET publico: mostra somente projetos publicados
app.get('/api/projetos', async (req, res) => {
    try {
        const sql = `
            SELECT id, nome, descricao, tecnologias,
                   link_github, ano, status
            FROM projetos
            WHERE status = 'publicado'
            ORDER BY ano DESC, id
        `;

        const [projetos] = await pool.query(sql);

        return res.status(200).json(projetos);
    } catch (erro) {
        return res.status(500).json({
            erro: 'Falha no servidor: ' + erro.message
        });
    }
});


// POST /api/login: confere email e senha e devolve o token.
app.post('/api/login', async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || !dados.email || !dados.senha) {
      return res.status(400).json({ erro: 'Informe email e senha' });
    }
    const [linhas] = await pool.execute('SELECT id, email, senha_hash FROM usuarios WHERE email = ?', [dados.email]);
    const usuario = linhas[0];
    if (!usuario) {
      return res.status(401).json({
    erro: 'Nao foi possivel entrar. Confira seu email e sua senha.'
    });
}
    const confere = await bcrypt.compare(dados.senha, usuario.senha_hash);
    if (!confere) {
      return res.status(401).json({
    erro: 'Nao foi possivel entrar. Confira seu email e sua senha.'});
    }
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, SEGREDO, { expiresIn: '1h'});
    res.json({ token });
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
app.post('/api/projetos', autenticar, async (req, res) => {
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


// PUT altera: o id vem no caminho (qual projeto) e os dados no corpo (o que gravar).
app.put('/api/projetos/:id',autenticar, async (req, res) => {
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
app.delete('/api/projetos/:id',autenticar, async (req, res) => {
    try{
        const [resultado] = await pool.execute('DELETE FROM projetos WHERE id = ?', [req.params.id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({erro: 'Projeto nao encontrado'});
        }
        res.status(204).end();
    } catch (erro) {
        res.status(500).json({erro: 'Falha no servidor: ' + erro.message});
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

 // POST: cadastrar uma tecnologia
app.post('/api/tecnologias', autenticar, async (req, res) => {
    try {
        const dados = req.body;

        if (!dados || typeof dados.nome !== 'string' || !dados.nome.trim()) {
            return res.status(400).json({
                erro: 'Informe o nome da tecnologia.'
            });
        }

        const sql = `
            INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [resultado] = await pool.execute(sql, [
            dados.nome.trim(),
            dados.categoria ?? 'Outros',
            dados.descricao ?? '',
            dados.ano_criacao ?? new Date().getFullYear(),
            'ativo'
        ]);

        return res.status(201).json({ id: resultado.insertId });
    } catch (erro) {
        return res.status(500).json({
            erro: 'Falha no servidor: ' + erro.message
        });
    }
});

// PUT: atualizar uma tecnologia
app.put('/api/tecnologias/:id', autenticar, async (req, res) => {
    try {
        const dados = req.body;

        if (!dados || typeof dados.nome !== 'string' || !dados.nome.trim()) {
            return res.status(400).json({
                erro: 'Informe o nome da tecnologia.'
            });
        }

        const sql = `
            UPDATE tecnologias
            SET nome = ?, categoria = ?, descricao = ?,
                ano_criacao = ?
            WHERE id = ?
        `;

        const [resultado] = await pool.execute(sql, [
            dados.nome.trim(),
            dados.categoria ?? 'Outros',
            dados.descricao ?? '',
            dados.ano_criacao ?? new Date().getFullYear(),
            req.params.id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Tecnologia nao encontrada.'
            });
        }

        return res.status(200).json({
            mensagem: 'Tecnologia atualizada com sucesso.'
        });
    } catch (erro) {
        return res.status(500).json({
            erro: 'Falha no servidor: ' + erro.message
        });
    }
});

// DELETE: excluir uma tecnologia
app.delete('/api/tecnologias/:id', autenticar, async (req, res) => {
    try {
        const [resultado] = await pool.execute(
            'DELETE FROM tecnologias WHERE id = ?',
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Tecnologia nao encontrada.'
            });
        }

        return res.status(204).end();
    } catch (erro) {
        return res.status(500).json({
            erro: 'Falha no servidor: ' + erro.message
        });
    }
});

// Metodo nao permitido nas rotas de projetos
app.all(/^\/api\/projetos(?:\/[^/]+)?\/?$/, (req, res) => {
    return res.status(405).json({
        erro: 'Metodo nao permitido'
    });
});
app.listen(PORTA, () => {
    console.log('API no ar em http://localhost:' + PORTA);
});