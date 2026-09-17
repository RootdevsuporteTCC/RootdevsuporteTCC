const bcrypt = require("bcrypt")

const userModel = require('../model/userModel')
const logModel = require('../model/logModel')
const usuarioValidacao = require("../validacoes/usuarioValidacao")

function criarUsuario(req, res) {
    const dados = req.body || {}

    const usuario = {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        avatar: dados.avatar,
    }

    const erroValidacao = usuarioValidacao.validarDadosUsuario(usuario)

    if (erroValidacao) {
        return res.status(400).send(erroValidacao)
    }

    const confirmarSenha = dados["confirmar-senha"]

    const erroSenha = usuarioValidacao.validarSenha(usuario.senha, confirmarSenha)

    if (erroSenha) {
        return res.status(400).send(erroSenha)
    }

    userModel.buscarUsuarioDuplicado(usuario, 0, (erroBusca, usuarios) => {
        if (erroBusca) {
            console.log("Erro ao verificar duplicidade:", erroBusca.code)

            return res.status(500).send("Não foi possível verificar os dados do cadastro.")
        }

        if (usuarios.length > 0) {
            return res.status(409).send("O nome de usuário ou e-mail já está cadastrado.")
        }

        userModel.criarUsuario(usuario, (erro, resultado) => {
            if (erro) {
                if (erro.code === "ER_DUP_ENTRY") {
                    return res.status(409).send("O nome de usuário ou e-mail já está cadastrado.")
                }

                console.log("Erro ao cadastrar usuário:", erro.code)

                return res.status(500).send("Não foi possível cadastrar o usuário")
            }

            const log = {
                userId: resultado.insertId,
                acao: "Cadastro realizado"
            }

            return logModel.registrarLog(log, (erroLog) => {
                if (erroLog) {
                    console.log("Erro ao registrar o cadastro:", erroLog)
                }

                return res.redirect("/login.html")
            })
        })
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

            const log = {
                userId: req.session.usuario.id,
                acao: "Login realizado"
            }

            return logModel.registrarLog(log, (erroLog) => {
                if (erroLog) {
                    console.log("Erro ao registrar o login:", erroLog)
                }

                return res.redirect("/")
            })

        } catch (erro) {
            console.log(erro)
            return res.status(500).send("Erro ao verificar senha")
        }
    })
}

function logoutUsuario(req, res) {
    const usuario = req.session.usuario

    req.session.destroy((erroSessao) => {
        if (erroSessao) {
            console.log("Erro ao encerrar a sessão:", erroSessao)

            return res.status(500).send("Erro ao fazer logout")
        }

        res.clearCookie("connect.sid")

        if (!usuario) {
            return res.redirect("/")
        }

        const log = {
            userId: usuario.id,
            acao: "Logout realizado"
        }

        return logModel.registrarLog(log, (erroLog) => {
            if (erroLog) {
                console.log("Erro ao registrar o logout:", erroLog)
            }

            return res.redirect("/")
        })
    })
}

function verificarSessao(req, res) {
    res.set("Cache-Control", "no-store") // faz o navegador não reutilizar essa resposta

    if (!req.session.usuario) {
        return res.json({ logado: false })
    }

    const id = req.session.usuario.id

    userModel.buscarPorId(id, (erro, usuario) => {
        if (erro) {
            console.log("Erro ao consultar usuário da sessão", erro)

            return res.status(500).json({ erro: "Não foi possível verificar a sessão" })
        }

        if (!usuario) {
            return req.session.destroy((erroSessao) => {
                if (erroSessao) {
                    console.log("Erro ao encerrar sessão:", erroSessao)

                    return res.status(500).json({ erro: "Não foi possível encerrar a sessão" })
                }

                res.clearCookie("connect.sid")

                return res.json({ logado: false })
            })
        }

        req.session.usuario = {
            id: usuario.user_id,
            nome: usuario.user_name,
            tipo: usuario.user_tipo,
            avatar: usuario.user_avatar
        }

        return res.status(200).json({
            logado: true,
            usuario: req.session.usuario
        })
    })
}

module.exports = {
    criarUsuario,
    loginUsuario,
    logoutUsuario,
    verificarSessao
}
