
// api-node/criar-usuario.js - cria o dono do Portfolio. Uso: node criar-usuario.js email senha
const bcrypt = require('bcryptjs');
const pool = require('./db');

async function criar() {
    const email = process.argv[2];
    const senha = process.argv[3];
    if (!email || !senha) {
        console.log('Uso: node criar-usuario.js email senha');
        return;
    }
    // O hash é de mão única: a senha em si nunca vai para o banco.
    const hash = await bcrypt.hash(senha, 10);
    const [resultado] = await pool.execute('INSERT INTO usuarios (email, senha_hash) VALUES (?, ?)', [email, hash]);
    console.log('Usuário ' + resultado.insertId + ' criado: ' + email);
}
criar();
