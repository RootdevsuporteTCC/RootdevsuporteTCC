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

module.exports = {
    encerrarSessao
}