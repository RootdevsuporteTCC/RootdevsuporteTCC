// recebe a requisição e verifica o usuário guardado na sessão
// responde com erro ou libera a próxima função da rota
function verificarAdmin(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).send("Você precisa fazer login.")
    }

    if (req.session.usuario.tipo !== 'admin') {
        return res.status(403).send("Acesso negado.")
    }

    // continua o fluxo da requisição depois de verificar o acesso
    next()
}

module.exports = verificarAdmin;