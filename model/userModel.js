const conexao = require('../config/database')

function criarUsuario(user, callback) {
    const sql = `
        INSERT INTO tb_usuarios
        (user_name, user_email, user_telefone, user_pass, user_avatar)
        VALUES (?, ?, ?, ?, ?)
    `

    conexao.query(sql, [
        user.nome,
        user.email,
        user.telefone,
        user.senha,
        user.avatar
    ], callback)
}

module.exports = {
    criarUsuario
}