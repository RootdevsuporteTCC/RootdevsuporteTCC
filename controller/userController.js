const userModel = require('../model/userModel')

function criarUsuario(req, res) {
    userModel.criarUsuario(req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar usuário.')
        }
        res.redirect('./')
    })
}

module.exports = {
    criarUsuario
}