const bcrypt = require("bcrypt")
const userModel = require('../model/userModel')

function criarUsuario(req, res) {
    /*
    const nome = req.body.nome.trim()
    const email = req.body.email.trim()
    const telefone = req.body.telefone
    const senha = req.body.senha
    const confirmarSenha = req.body.confirmarSenha
    const avatar = req.body.avatar

    if (!nome || !email || !senha || !confirmarSenha) {
        alert("Você precisa preencher as informações obrigatórias")
        return
    }

    //verificações nome: até 80 caracteres, não contém '@' nem espaços
    if (nome.length > 80 || nome.length < 3) {
        alert("Nome de usuário precisa ter mais que 3 e menos que 80 caracteres")
        return
    }
    if (nome.includes('@')) {
        alert("O nome não pode conter '@'")
        return
    }
    if (nome.includes(' ')) {
        alert("O nome de usuário não pode conter espaços")
        return
    }

    //verificações email: até 255 caracteres, passa por regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (email.length > 255) {
        alert("O e-mail não pode ter mais de 255 caracteres")
        return
    }
    if (!emailRegex.test(email)) {
        alert("Insira um e-mail válido")
        return
    }

    //verificações telefone: remove qualquer caractere que não for número
    telefoneNovo = telefone.replace(/\d/g, "")

    //verificações senha: de 6 até 64 caracteres, tem pelo menos um numero e um caractere especial


    //verificações avatar: até 10 caracteres

    */
    userModel.criarUsuario(req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar usuário.')
        }
        res.redirect('/login.html')
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
        res.clearCookie("connect.sid")
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
