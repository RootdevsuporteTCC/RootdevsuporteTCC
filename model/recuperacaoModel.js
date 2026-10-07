const conexao = require("../config/database")


function criarRecuperacao(recuperacao, callback) {
    const sql = `
        INSERT INTO tb_recuperacoes
            (tb_usuarios_user_id, rec_codigo, rec_expiracao)
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
    `
    // DATE_ADD(NOW(), INTERVAL 10 MINUTE) calcula um horário futuro 10 minutos depois da data e hora atuais

    conexao.query(sql, [
        recuperacao.userId,
        recuperacao.codigoHash
    ], callback)
}


function buscarUltimaRecuperacao(userId, callback) {
    const sql = `
        SELECT
            rec_id,
            tb_usuarios_user_id,
            rec_codigo,
            rec_usado,
            (rec_expiracao > NOW()) AS rec_valida
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

function concluirRecuperacao(recuperacao, senhaHash, callback) {
    // altera a senha e marca o código como usado na mesma consulta
    // exige a recuperação mais recente, ainda válida e ligada à conta e ao email informados
    const sql = `
        UPDATE tb_usuarios AS usuario

        INNER JOIN tb_recuperacoes AS recuperacao
            ON recuperacao.tb_usuarios_user_id = usuario.user_id

        LEFT JOIN tb_recuperacoes AS mais_recente
            ON mais_recente.tb_usuarios_user_id = usuario.user_id
            AND mais_recente.rec_id > recuperacao.rec_id

        SET
            usuario.user_pass = ?,
            recuperacao.rec_usado = 1

        WHERE usuario.user_id = ?
            AND usuario.user_email = ?
            AND recuperacao.rec_id = ?
            AND recuperacao.rec_usado = 0
            AND recuperacao.rec_expiracao > NOW()
            AND mais_recente.rec_id IS NULL
    `

    conexao.query(sql, [
        senhaHash,
        recuperacao.userId,
        recuperacao.email,
        recuperacao.recId
    ], callback)
}

module.exports = {
    criarRecuperacao,
    buscarUltimaRecuperacao,
    concluirRecuperacao
}