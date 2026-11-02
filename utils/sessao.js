// encerra a sessão no servidor e solicita a remoção do cookie no navegador
function encerrarSessao(req, res, callback) {
    if (!req.session) {
        res.clearCookie("connect.sid")
        return callback(null)
    }

    req.session.destroy((erro) => {
        
        // remove o cookie mesmo se o encerramento retornar um erro
        res.clearCookie("connect.sid")
        return callback(erro)
    })
}

// cria uma nova sessão e salva os dados da conta autenticada
function iniciarSessao(req, usuario, callback) {
    req.session.regenerate((erro) => {
        if (erro) {
            callback(erro)
            return
        }

        req.session.usuario = usuario

        // aguarda o salvamento antes de liberar a continuação do login
        req.session.save((erroSalvar) => {
            if (erroSalvar) {

                // remove os dados do login quando não consegue salvar a sessão
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