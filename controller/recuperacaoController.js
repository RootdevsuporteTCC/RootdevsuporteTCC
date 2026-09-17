const crypto = require("crypto")
const userModel = require("../model/userModel")
const recuperacaoModel = require("../model/recuperacaoModel")
const logModel = require("../model/logModel")
const emailService = require("../service/emailService")

function solicitarRecuperação(req, res) {
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
                    userId: usuario.userId,
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

module.exports = {
    solicitarRecuperação
}