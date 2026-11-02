const conexao = require('../config/database')

// salva o cadastro com o hash da senha preparado pelo service
function criarUsuario(usuario, callback) {
    const sql = `
        INSERT INTO tb_usuarios
        (user_name, user_email, user_pass, user_avatar)
        VALUES (?, ?, ?, ?)
    `

    conexao.query(sql, [
        usuario.nome,
        usuario.email,
        usuario.senhaHash,
        usuario.avatar
    ], callback)
}

// exclui a conta pelo id e devolve o resultado pelo callback
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

// atualiza nome email tipo e avatar na edição feita pelo admin
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

// atualiza nome email e avatar sem alterar a senha ou o tipo da conta
function atualizarPerfil(id, usuario, callback) {
    const sql = `
        UPDATE tb_usuarios
        SET user_name = ?,
            user_email = ?,
            user_avatar = ?
        WHERE user_id = ?
    `

    conexao.query(sql, [
        usuario.nome,
        usuario.email,
        usuario.avatar || ":D",
        id
    ], callback)
}

// busca os dados da conta pelo id sem retornar o hash da senha
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

// busca a conta pelo email incluindo o hash para autenticação
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

// consulta os usuários com pesquisa limite e deslocamento sem retornar o hash
function buscarTodosUsuarios(pesquisa, limite, deslocamento, callback) {
    let sql = `
        SELECT user_id, user_name, user_email, user_tipo, user_avatar
        FROM tb_usuarios
    `;

    const valores = []

    // acrescenta os filtros somente quando existe um termo de pesquisa
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

    // ordena os registros e limita a consulta para a página solicitada
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

// busca a conta por nome ou email incluindo o hash para autenticação
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

// procura outra conta com o mesmo nome ou email
function buscarUsuarioDuplicado(usuario, idIgnorado, callback) {
    // ignora a própria conta para permitir manter seu nome e email na edição
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

// busca somente o hash da senha para conferir operações do perfil
function buscarSenhaPorId(id, callback) {
    const sql = `
        SELECT user_pass
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

module.exports = {
    criarUsuario,
    excluirUsuario,
    atualizarUsuario,
    atualizarPerfil,
    buscarPorId,
    buscarPorEmail,
    buscarTodosUsuarios,
    buscarPorLogin,
    buscarUsuarioDuplicado,
    buscarSenhaPorId
}