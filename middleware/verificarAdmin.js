// recebe a requisição e verifica o usuário guardado na sessão
// responde com erro ou libera a próxima função da rota
function verificarAdmin(req, res, next) {
    if (!req.session.usuario) {

        // status 401 - autenticação ausente ou inválida
        return res.status(401).send("Você precisa fazer login.")
    }

    if (req.session.usuario.tipo !== 'admin') {

        // status 403 - acesso negado
        return res.status(403).send("Acesso negado.")
    }

    // continua o fluxo da requisição depois de verificar o acesso
    next()
}

module.exports = verificarAdmin;