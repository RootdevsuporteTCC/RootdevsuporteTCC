const conexao = require("../config/database")

// recebe usuário e ação e entrega o resultado da gravação pelo callback
function registrarLog(log, callback) {
    const sql = `
        INSERT INTO tb_logs_acesso
            (tb_usuarios_user_id, log_acao)
        VALUES (?, ?)
    `
    // permite registrar ações sem vínculo com uma conta
    conexao.query(sql, [
        log.userId || null,
        log.acao
    ], callback)
}

// recebe pesquisa, limite e deslocamento e entrega os logs encontrados pelo callback
function buscarTodosLogs(pesquisa, limite, deslocamento, callback) {
    // usa left join para incluir os logs que não possuem usuário vinculado
    let sql = `
        SELECT
            tb_logs_acesso.log_id,
            tb_logs_acesso.tb_usuarios_user_id,
            tb_logs_acesso.log_acao,
            tb_logs_acesso.log_data,
            tb_usuarios.user_name
        FROM tb_logs_acesso

        LEFT JOIN tb_usuarios
            ON tb_logs_acesso.tb_usuarios_user_id = tb_usuarios.user_id
    `

    const valores = []

    if (pesquisa) {
        sql += `
            WHERE tb_logs_acesso.log_acao LIKE ?
            OR tb_usuarios.user_name LIKE ?
            OR CAST(tb_logs_acesso.log_id AS CHAR) LIKE ?
            OR CAST(tb_logs_acesso.tb_usuarios_user_id AS CHAR) LIKE ?
        `
        const termo = `%${pesquisa}%`

        valores.push(termo, termo, termo, termo)
    }

    sql += `
        ORDER BY tb_logs_acesso.log_data DESC,
            tb_logs_acesso.log_id DESC
        LIMIT ? OFFSET ?
    `

    valores.push(limite, deslocamento)

    conexao.query(sql, valores, callback)
}

module.exports = {
    registrarLog,
    buscarTodosLogs
}