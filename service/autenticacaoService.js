const userModel = require("../model/userModel")
const { compararHash } = require("./criptografiaService")

// verifica as credenciais e devolve o resultado sem criar a sessão
function autenticar(login, senha, exigirAdmin, callback) {
    if (typeof login !== "string" || typeof senha !== "string" || !login.trim() || !senha || Buffer.byteLength(senha, "utf8") > 72) {
        callback(null, {
            status: 400,
            erro: "Informe um login e uma senha válidos."
        })
        return
    }

    // busca por email no acesso do admin e por nome ou email no login comum
    const buscarUsuario = exigirAdmin ? userModel.buscarPorEmail : userModel.buscarPorLogin

    buscarUsuario(login.trim(), async (erro, usuario) => {
        if (erro) {
            callback(erro)
            return
        }

        // usa a mesma mensagem para conta não encontrada e senha incorreta
        if (!usuario) {
            callback(null, {
                status: 401,
                erro: "Login ou senha incorretos."
            })
            return
        }

        let senhaCorreta

        try {
            senhaCorreta = await compararHash(senha, usuario.user_pass)
        } catch (erroSenha) {
            callback(erroSenha)
            return
        }

        if (!senhaCorreta) {
            callback(null, {
                status: 401,
                erro: "Login ou senha incorretos."
            })
            return
        }

        // confere a permissão de admin somente depois de confirmar a senha
        if (exigirAdmin && usuario.user_tipo !== "admin") {
            callback(null, {
                status: 403,
                erro: "Você não possui permissão de administrador."
            })
            return
        }

        // devolve os dados da conta sem incluir o hash da senha
        callback(null, {
            usuario: {
                id: usuario.user_id,
                nome: usuario.user_name,
                tipo: usuario.user_tipo,
                avatar: usuario.user_avatar,
            }
        })
    })
}

module.exports = {
    autenticar
}