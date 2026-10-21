function encerrarSessao(req, res, callback) {
    if (!req.session) {
        res.clearCookie("connect.sid")
        return callback(null)
    }

    req.session.destroy((erro) => {
        res.clearCookie("connect.sid")
        return callback(erro)
    })
}

function iniciarSessao(req, usuario, callback) {
    req.session.regenerate((erro) => {
        if (erro) {
            callback(erro)
            return
        }

        req.session.usuario = usuario

        req.session.save((erroSalvar) => {
            if (erroSalvar) {
                delete req.session.usuario

                callback(erroSalvar)
                return
            }

            callback(null)
        })
    })
}

module.exports = {
    encerrarSessao,
    iniciarSessao
}