const bcrypt = require("bcrypt")
const userModel = require('../model/userModel')

function criarUsuario(req, res) {
    userModel.criarUsuario(req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar usuário.')
        }
        res.redirect('/')
    })
}

function loginUsuario(req, res) {
    const login = req.body.login
    const senha = req.body.senha

    userModel.buscarPorLogin(login, async (erro, usuario) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send("Erro ao buscar usuário")
        }

        if (!usuario) {
            return res.status(401).send("Nome, e-mail ou senha incorretos")
        }

        try {
            const senhaCorreta = await bcrypt.compare(
                senha,
                usuario.user_pass
            )

            if (!senhaCorreta) {
                return res.status(401).send("Nome, e-mail ou senha incorretos")
            }

            req.session.usuario = {
                id: usuario.user_id,
                nome: usuario.user_name,
                tipo: usuario.user_tipo,
                avatar: usuario.user_avatar
            }

            return res.redirect("/")
        } catch (erro) {
            console.log(erro)
            return res.status(500).send("Erro ao verificar senha")
        }
    })
}

function logoutUsuario(req, res) {
    req.session.destroy((erro) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send("Erro ao fazer logout")
        }
        res.clearCookie("Connect.sid")
        return res.redirect("/")
    })
}

function verificarSessao(req, res) {
    if (!req.session.usuario) {
        return res.status(200).json({ logado: false })
    }

    return res.status(200).json({
        logado: true,
        usuario: req.session.usuario
    })
}

module.exports = {
    criarUsuario,
    loginUsuario,
    logoutUsuario,
    verificarSessao
}