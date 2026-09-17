const bcrypt = require('bcrypt')
const conexao = require('../config/database')

async function criarUsuario(user, callback) {

    try {

        const senhaHash = await bcrypt.hash(user.senha, 10);

        const sql = `
            INSERT INTO tb_usuarios
            (user_name, user_email, user_pass, user_avatar)
            VALUES (?, ?, ?, ?)
        `

        conexao.query(sql, [
            user.nome,
            user.email,
            senhaHash,
            (user.avatar || ":D")
        ], callback)
    
    } catch (erro) {
        callback(erro);
    }
}

function excluirUsuario(id, callback) {
    const sql = `
        DELETE FROM tb_usuarios
        WHERE user_id = ?
    `

    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            return callback(erro)
        }

        return callback(null, resultado)
    })
}

function atualizarUsuario(id, usuario, callback) {

    const sql = `
        UPDATE tb_usuarios
        SET
            user_name = ?,
            user_email = ?,
            user_tipo = ?,
            user_avatar = ?
        WHERE user_id = ?
    `

    conexao.query(
        sql, [
            usuario.nome,
            usuario.email,
            usuario.tipo,
            usuario.avatar,
            id
        ], (erro, resultado) => {
            if (erro) {
                return callback(erro)
            }

            return callback(null, resultado)
        }
    )
}

function buscarPorId(id, callback) {
    const sql = `
        SELECT user_id, user_name, user_email, user_tipo, user_avatar
        FROM tb_usuarios
        WHERE user_id = ?
    `

    conexao.query(sql, [id], (erro, usuarios) => {
        if (erro) {
            return callback(erro)
        }

        return callback(null, usuarios[0])
    })
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

function buscarTodosUsuarios(pesquisa, limite, deslocamento, callback) {
    let sql = `
        SELECT user_id, user_name, user_email, user_tipo, user_avatar
        FROM tb_usuarios
    `;

    const valores = []

    if (pesquisa) {
        sql += `
            WHERE user_name LIKE ?
            OR user_email LIKE ?
            OR user_tipo LIKE ?
            OR CAST(user_id AS CHAR) LIKE ?
        `

        const termo = `%${pesquisa}%`

        valores.push(termo, termo, termo, termo)
    }

    sql += `
        ORDER BY user_id ASC
        LIMIT ? OFFSET ?
    `

    valores.push(limite, deslocamento)

    conexao.query(sql, valores, (erro, usuarios) => {
        if (erro) {
            return callback(erro)
        }

        callback(null, usuarios)
    })
}

function buscarPorLogin(login, callback) {
    const sql = `
        SELECT *
        FROM tb_usuarios
        WHERE user_email = ?
        OR user_name = ?
    `

    conexao.query(sql, [login, login], (erro, usuarios) => {
        if (erro) {
            return callback(erro)
        }

        return callback(null, usuarios[0])
    })
}

function buscarUsuarioDuplicado(usuario, idIgnorado, callback) {
    const sql = `
        SELECT user_id
        FROM tb_usuarios
        WHERE (user_name = ? OR user_email = ?)
        AND user_id <> ?
        LIMIT 1
    `

    conexao.query(sql, [
        usuario.nome,
        usuario.email,
        idIgnorado
    ], callback)
}

module.exports = {
    criarUsuario,
    excluirUsuario,
    atualizarUsuario,
    buscarPorId,
    buscarPorEmail,
    buscarTodosUsuarios,
    buscarPorLogin,
    buscarUsuarioDuplicado
}