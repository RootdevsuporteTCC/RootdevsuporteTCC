const conexao = require("../config/database")

// salva o hash do código com prazo de dez minutos
function criarRecuperacao(recuperacao, callback) {
    const sql = `
        INSERT INTO tb_recuperacoes
            (tb_usuarios_user_id, rec_codigo, rec_expiracao)
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
    `
    // o prazo termina dez minutos após o horário atual do banco

    conexao.query(sql, [
        recuperacao.userId,
        recuperacao.codigoHash
    ], callback)
}

// busca a última recuperação da conta e confere o prazo pelo horário do banco
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

// recebe o hash da nova senha e tenta concluir a recuperação no banco
function concluirRecuperacao(recuperacao, senhaHash, callback) {
    // altera a senha e marca o código como usado na mesma consulta
    // exige a recuperação mais recente ainda válida e ligada à conta e ao email informados
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