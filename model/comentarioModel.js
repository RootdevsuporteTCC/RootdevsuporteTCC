const conexao = require('../config/database')

function buscarPorTopico(categoria, topico, callback) {
    const sql = `
        SELECT 
            tb_comentarios.com_id,
            tb_comentarios.com_user_id,
            tb_comentarios.com_texto,
            tb_comentarios.com_data,
            tb_usuarios.user_name,
            tb_usuarios.user_avatar
        FROM tb_comentarios

        INNER JOIN tb_usuarios
            ON tb_comentarios.com_user_id = tb_usuarios.user_id

        WHERE tb_comentarios.com_categoria = ?
            AND tb_comentarios.com_topico = ?

        ORDER BY tb_comentarios.com_data DESC
    `

    conexao.query(sql, [categoria, topico], (erro, comentarios) => {
        if (erro) {
            return callback(erro)
        }

        return callback(null, comentarios)
    })
}

function salvarComentario(comentario, callback) {
    const sql = `
        INSERT INTO tb_comentarios
        (com_user_id, com_texto, com_categoria, com_topico)
        VALUES (?, ?, ?, ?)
    `

    conexao.query(sql, [
        comentario.userId,
        comentario.texto,
        comentario.categoria,
        comentario.topico
    ], callback)
}

function excluirComentario(comentario, callback) {
    const sql = `
        DELETE FROM tb_comentarios
        WHERE com_id = ?
        AND com_user_id = ?
    `

    conexao.query(sql, [
        comentario.id,
        comentario.userId
    ], callback)
}

function buscarTodosComentarios(pesquisa, limite, deslocamento, callback) {
    let sql = `
        SELECT
            tb_comentarios.com_id,
            tb_comentarios.com_texto,
            tb_comentarios.com_categoria,
            tb_comentarios.com_topico,
            tb_comentarios.com_data,
            tb_usuarios.user_name
        FROM tb_comentarios

        INNER JOIN tb_usuarios
            ON tb_comentarios.com_user_id = tb_usuarios.user_id
    `

    const valores = []

    if (pesquisa) {
        sql += `
            WHERE tb_comentarios.com_texto LIKE ?
            OR tb_usuarios.user_name LIKE ?
            OR tb_comentarios.com_categoria LIKE ?
            OR tb_comentarios.com_topico LIKE ?
            OR CAST(tb_comentarios.com_id AS CHAR) LIKE ?
        `

        const termo = `%${pesquisa}%`

        valores.push(termo, termo, termo, termo, termo)
    }

    sql += `
        ORDER BY tb_comentarios.com_data DESC,
            tb_comentarios.com_id DESC
        LIMIT ? OFFSET ?
    `

    valores.push(limite, deslocamento)
    conexao.query(sql, valores, callback)
}

function excluirComentarioAdmin(id, callback) {
    const sql = `
        DELETE FROM tb_comentarios
        WHERE com_id = ?
    `

    conexao.query(sql, [id], callback)
}

module.exports = {
    buscarPorTopico,
    salvarComentario,
    excluirComentario,
    buscarTodosComentarios,
    excluirComentarioAdmin
}