// api-node/server.js - a API do portfolio em Node (Aula 21)
const express = require('express');
const cors = require('cors');

const app = express();
const PORTA = 3000;
// Deixa outrra origem (o Angular na porta 4200) chamar esta API
app.use(cors())

// O mesmo contarto do api/projetos.php: a lista de projetos publicados.
// Por enquanto a lista mora aqui; na Aula 22 ela vem do MariaDB.

const projetos = [
    {
    id: 1,
    nome: 'Portfolio Angular',
    descricao: 'Meu protfolio com Angular e Angular Material.',
    tecnologias: 'Angular, TypeScript',
    link_github: null,
    ano: 2026
    },

    {
    id: 2,
    nome: ' API do Portfolio em PHP',
    descricao: 'Endpoints de projetos e catalogo com PDO e MariaDB.',
    tecnologias: 'PHP, MariaDB',
    link_github: null,
    ano: 2026
    },

    {
    id: 3,
    nome: 'Sistema de Cadastro v1',
    descricao: 'CRUD em PHP do 1° trimestre.',
    tecnologias: 'PHP, MariaDB, Bootstrap',
    link_github: null,
    ano: 2026
    },

];

app.get('/api/projetos', (req, res) => {
    res.json(projetos);
});

app.listen(PORTA, () => {
    console.log('API no ar em http://localhost: ' + PORTA);
});