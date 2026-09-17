const conexao = require("../config/database")
const bcrypt = require("bcrypt")

async function criarRecuperacao(recuperacao, callback) {
    try {
        const codigoHash = await bcrypt.hash(recuperacao.codigo, 10)

        const sql = `
            INSERT INTO tb_recuperações
                (tb_usuarios_user_id, rec_codigo, rec_expiracao)
            VALUES (?, ?, DATE_ADD(NOW(), INERVAL 10 MINUTE))
        `

        conexao.query(sql, [
            recuperacao.userId,
            codigoHash
        ], callback)
    } catch (erro) {
        callback(erro)
    }
}

function buscarUltimaRecuperacao(userId, callback) {
    const sql = `
        SELECT
            rec_id,
            tb_usuarios_user_id,
            rec_codigo,
            rec_expiracao,
            rec_usado
        FROM tb_recuperacoes
        WHERE tb_usuarios_user_id = ?
        ORDER BY rec_id DESC
        LIMIT 1
    `

    conexao.query(sql, [userId], (erro, resultados) => {
        if (erro) {
            return callback(erro)
        }

        callback(null, resultados[0])
    })
}

module.exports = {
    criarRecuperacao,
    buscarUltimaRecuperacao
}