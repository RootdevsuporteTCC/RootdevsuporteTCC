const conexao = require('../config/database')

function buscarPorTopico(categoria, topico, callback) {
    const sql = `
        SELECT *
        FROM tb_comentarios
        WHERE com_categoria = ?
        AND com_topico = ?
        ORDER BY com_data DESC
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