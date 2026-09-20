const bcrypt = require('bcrypt')
const conexao = require('../config/database')

// recebe os dados do cadastro, salva a senha com hash e manda o resultado pelo callback
async function criarUsuario(user, callback) {

    try {
        // gera o hash para evitar o armazenamento da senha original
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

// recebe o id, exclui a conta e manda o resultado pelo callback
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

// recebe id e dados da edição do admin e manda o resultado pelo callback
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

// recebe id e dados do perfil, atualiza nome, email e avatar e responde pelo callback
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

// recebe o id e entrega pelo callback o usuário sem o campo de senha ou undefined
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

// recebe o email e entrega pelo callback o cadastro completo ou undefined
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

// recebe pesquisa, limite e deslocamento e entrega a lista encontrada pelo callback
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

// recebe nome ou email e entrega pelo callback o cadastro completo ou undefined
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

// recebe nome, email e id ignorado e entrega pelo callback a lista de coincidencias
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

// recebe o id e entrega pelo callback o registro com o hash da senha ou undefined
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