const crypto = require("crypto")
const bcrypt = require("bcrypt")

const userModel = require("../model/userModel")
const recuperacaoModel = require("../model/recuperacaoModel")
const logModel = require("../model/logModel")
const emailService = require("../service/emailService")
const usuarioValidacao = require("../validacoes/usuarioValidacao")

function solicitarRecuperacao(req, res) {
    const dados = req.body || {}

    if (typeof dados.email !== "string") {
        return res.status(400).json({ erro: "Informe um e-mail válido." })
    }

    const email = dados.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (email.length > 254 || !emailRegex.test(email)) {
        return res.status(400).json({ erro: "Informe um e-mail válido." })
    }

    const codigo = crypto.randomBytes(4).toString("hex").toUpperCase()

    res.status(202).json({ mensagem: "Solicitação recebida. Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação." })

    userModel.buscarPorEmail(email, (erro, usuario) => {
        if (erro) {
            console.log("Erro ao buscar usuário para recuperação:", erro)
            return
        }

        if (!usuario) {
            return
        }

        const recuperacao = {
            userId: usuario.user_id,
            codigo: codigo
        }

        recuperacaoModel.criarRecuperacao(recuperacao, (erro) => {
            if (erro) {
                console.log("Erro ao salvar recuperação:", erro.code)
                return
            }

            emailService.enviarCodigoRecuperacao(usuario.user_email, codigo, (erroEnvio) => {
                let acao = "Recuperação solicitada: código encaminhado ao serviço de e-mail"

                if (erroEnvio) {
                    console.log("Erro ao enviar código de recuperação:", erroEnvio.code)
                
                    acao = "Recuperação solicitada: falha no envio do código"
                }

                logModel.registrarLog({
                    userId: usuario.user_id,
                    acao: acao
                }, (erroLog) => {
                    if (erroLog) {
                        console.log("Erro ao registrar log de recuperação:", erroLog.code)
                    }
                })
            })
        })
    })
}

function verificarCodigo(req, res) {
    const dados = req.body || {}
    const mensagemInvalida = "Código inválido ou expirado"

    res.set("Cache-control", "no-store")

    delete req.session.recuperacao

    if (typeof dados.email !== "string" || typeof dados.codigo !== "string") {
        return res.status(400).json({ erro: mensagemInvalida })
    }

    const email = dados.email.trim()
    const codigo = dados.codigo.trim().toUpperCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (email.length > 254 || !emailRegex.test(email) || !/^[A-F0-9]{8}$/.test(codigo)) {
        return res.status(400).json({ erro: mensagemInvalida })
    }

    userModel.buscarPorEmail(email, (erro, usuario) => {
        if (erro) {
            console.log("Erro ao consultar usuário:", erro.code)

            return res.status(500).json({ erro: "Não foi possível verificar o código." })
        }

        if (!usuario) {
            return res.status(400).json({ erro: mensagemInvalida })
        }

        recuperacaoModel.buscarUltimaRecuperacao(usuario.user_id, (erro, recuperacao) => {
            if (erro) {
                console.log("Erro ao consultar recuperacao:", erro.code)

                return res.status(500).json({ erro: "Não foi possível verificar o código." })
            }

            if (!recuperacao || recuperacao.rec_usado !== 0) {
                return res.status(400).json({ erro: mensagemInvalida })
            }

            const expiracao = new Date(recuperacao.rec_expiracao).getTime()

            if (!Number.isFinite(expiracao) || expiracao <= Date.now()) {
                return res.status(400).json({ erro: mensagemInvalida })
            }

            bcrypt.compare(codigo, recuperacao.rec_codigo, (erro, codigoCorreto) => {
                if (erro) {
                    console.log("Erro ao comparar código:", erro.message)

                    return res.status(500).json({ erro: "Não foi possível verificar o código." })
                }

                if (!codigoCorreto || expiracao <= Date.now()) {
                    return res.status(400).json({ erro: mensagemInvalida })
                }

                req.session.regenerate((erro) => {
                    if (erro) {
                        return res.status(500).json({ erro: "Não foi possível iniciar a recuperação." })
                    }

                    req.session.recuperacao = {
                        recId: recuperacao.rec_id,
                        userId: usuario.user_id,
                        email: usuario.user_email,
                        expiracao: expiracao
                    }

                    req.session.save((erro) => {
                        if (erro) {
                            delete req.session.recuperacao

                            return res.status(500).json({ erro: "Não foi possível salvar a autorização." })
                        }

                        logModel.registrarLog({
                            userId: usuario.user_id,
                            acao: "Código de recuperação validado"
                        }, (erroLog) => {
                            if (erroLog) {
                                console.log("Erro ao registrar log:", erroLog.code)
                            }
                        })

                        return res.json({
                            mensagem: "Código verificado. Informe sua nova senha."
                        })
                    })
                })
            })
        })
    })
}

function redefinirSenha(req, res) {
    res.set("Cache-Control", "no-store")

    if (!req.is("application/json")) {
        return res.status(415).json({ erro: "Envie os dados em formato JSON." })
    }

    const dados = req.body || {}
    const recuperacao = req.session.recuperacao

    if (!recuperacao || !Number.isFinite(recuperacao.expiracao) || recuperacao.expiracao <= Date.now()) {
        delete req.session.recuperacao

        return res.status(401).json({ erro: "Solicite e valide um novo código de recuperação." })
    }

    const erroSenha = usuarioValidacao.validarSenha(dados.senha, dados.confirmarSenha)

    if (erroSenha) {
        return res.status(400).json({ erro: erroSenha })
    }

    recuperacaoModel.concluirRecuperacao(recuperacao, dados.senha, (erro, resultado) => {
        if (erro) {
            console.log("Erro ao redefinir senha:", erro.code)

            return res.status(500).json({ erro: "Não foi possível alterar a senha. Tente novamente." })
        }

        if (resultado.affectedRows === 0) {
            delete req.session.recuperacao

            return res.status(409).json({ erro: "Esta recuperação não está mais disponível, Solicite um novo código." }) 
        }

        logModel.registrarLog({
            userId: recuperacao.userId,
            acao: "Senha redefinida por recuperação de e-mail"
        }, (erroLog) => {
            if (erroLog) {
                console.log("Erro ao registrar a log da recuperação:", erroLog.code)
            }
        })

        delete req.session.recuperacao

        req.session.destroy((erroSessao) => {
            if (erroSessao) {
                console.log("Erro ao encerrar sessão de recuperação:", erroSessao.message)
            }

            res.clearCookie("connect.sid")

            return res.json({ mensagem: "Senha alterada com sucesso. Faça login com sua nova senha." })
        })
    })
}

module.exports = {
    solicitarRecuperacao,
    verificarCodigo,
    redefinirSenha
}