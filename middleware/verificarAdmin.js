const userModel = require("../model/userModel")

function negarAcessoAdmin(req, res, status, mensagem) {
    return res.status(status).json({ erro: mensagem })
}

// permite continuar somente quando a conta existe e ainda é admin
function verificarAdmin(req, res, next) {
    if (!req.session.usuario) {
        return negarAcessoAdmin(req, res, 401, "Você precisa fazer login.")
    }

    const id = req.session.usuario.id

    // consulta a conta em cada requisição para conferir se o acesso continua permitido
    userModel.buscarPorId(id, (erro, usuario) => {
        if (erro) {
            return next(erro)
        }

        if (!usuario) {
            delete req.session.usuario
            
            return negarAcessoAdmin(req, res, 401, "Faça login novamente.")
        }

        // atualiza a sessão com os dados atuais da conta
        req.session.usuario = {
            id: usuario.user_id,
            nome: usuario.user_name,
            tipo: usuario.user_tipo,
            avatar: usuario.user_avatar
        }

        if (usuario.user_tipo !== "admin") {
            return negarAcessoAdmin(req, res, 403, "Acesso negado")
        }

        return next()
    })
}

module.exports = verificarAdmin