const bcrypt = require("bcrypt")
const userModel = require('../model/userModel')

function criarUsuario(req, res) {
    cadastro = {
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        senha: req.body.senha,
        confirmarSenha: req.body.confirmarSenha,
        avatar: req.body.avatar
    }

    if (!cadastro.nome || !cadastro.email || !cadastro.senha || !cadastro.confirmarSenha) {
        alert("Você precisa preencher as informações obrigatórias")
        return
    }

    //verificações nome
    if (cadastro.nome.length > 80) {
        alert("Nome de usuário não pode conter mais de 80 caracteres")
        return
    }
    if (cadastro.nome.includes('@')) {
        alert("O nome não pode conter '@'")
        return
    }
    if (cadastro.nome.includes(' ')) {
        alert("O nome de usuário não pode conter espaços")
        return
    }

    //verificações email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (cadastro.email.length > 255) {
        alert("O e-mail não pode ter mais de 255 caracteres")
        return
    }
    if (!emailRegex.test(cadastro.email)) {
        alert("Insira um e-mail válido")
        return
    }




    //nome: até 80 caracteres, não contém '@' nem espaços
    //email: até 255 caracteres, passa por regex
    //telefone: remove '(', ')', ' ', '-'; depois passa por regex
    //senha: de 6 até 64 caracteres, tem pelo menos um numero e um caractere especial
    //avatar: até 10 caracteres


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