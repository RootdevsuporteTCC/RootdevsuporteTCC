const bcrypt = require('bcrypt')
const conexao = require('../config/database')

async function criarUsuario(user, callback) {

    try {

        const senhaHash = await bcrypt.hash(user.senha, 10);

        const sql = `
            INSERT INTO tb_usuarios
            (user_name, user_email, user_telefone, user_pass, user_avatar)
            VALUES (?, ?, ?, ?, ?)
        `

        conexao.query(sql, [
            user.nome,
            user.email,
            user.telefone,
            senhaHash,
            user.avatar
        ], callback)
    
    } catch (erro) {
        callback(erro);
    }
}

function buscarPorEmail(email, callback) {
    
    const sql = `
        SELECT * FROM tb_usuarios
        WHERE user_email = ?
    `

    conexao.query(sql, [email], (erro, usuarios) => {
        if (erro) {
            return callback(erro);
        }

        return callback(null, usuarios[0])
    })
}




module.exports = {
    criarUsuario,
    buscarPorEmail
}