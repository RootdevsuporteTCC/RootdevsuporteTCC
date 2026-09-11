const conexao = require('../config/database')

function buscarPorTopico(categoria, topico, callback) {
    const sql = `
        SELECT 
            tb_comentarios.com_id,
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

module.exports = {
    buscarPorTopico
}