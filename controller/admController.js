const admModel = require('../model/userModel')

function loginAdm(req, res) {
    admModel.loginAdm(req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao fazer login.')
        }
        res.send("")
    })
}

module.exports = {
    loginAdm
}