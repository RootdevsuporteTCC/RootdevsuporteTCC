function verificarAdmin(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).send("Você precisa fazer login.")
    }

    if (req.session.usuario.tipo !== 'admin') {
        return res.status(403).send("Acesso negado.")
    }

    next();
}

module.exports = verificarAdmin;