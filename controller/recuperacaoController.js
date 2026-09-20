const crypto = require("crypto")
const bcrypt = require("bcrypt")

const userModel = require("../model/userModel")
const recuperacaoModel = require("../model/recuperacaoModel")
const logModel = require("../model/logModel")
const emailService = require("../service/emailService")
const usuarioValidacao = require("../validacoes/usuarioValidacao")

// recebe o email e responde com uma mensagem genérica de solicitação
// para contas existentes, salva a recuperação e encaminha o código por email
function solicitarRecuperacao(req, res) {
    const dados = req.body || {}

    if (typeof dados.email !== "string") {

        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Informe um e-mail válido." })
    }

    const email = dados.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (email.length > 254 || !emailRegex.test(email)) {

        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Informe um e-mail válido." })
    }

    // gera um código aleatório com oito caracteres hexadecimais
    const codigo = crypto.randomBytes(4).toString("hex").toUpperCase()

    // responde sem revelar se o email pertence a uma conta cadastrada
    // status 202 - solicitação aceita
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

// recebe email e código e verifica a recuperação mais recente
// salva a autorização na sessão e responde em json quando o código é válido
function verificarCodigo(req, res) {
    const dados = req.body || {}
    const mensagemInvalida = "Código inválido ou expirado"

    res.set("Cache-control", "no-store")

    // remove uma autorização anterior antes de verificar outro código
    delete req.session.recuperacao

    if (typeof dados.email !== "string" || typeof dados.codigo !== "string") {
        
        // status 400 - requisição inválida
        return res.status(400).json({ erro: mensagemInvalida })
    }

    const email = dados.email.trim()
    const codigo = dados.codigo.trim().toUpperCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (email.length > 254 || !emailRegex.test(email) || !/^[A-F0-9]{8}$/.test(codigo)) {
        
        // status 400 - requisição inválida
        return res.status(400).json({ erro: mensagemInvalida })
    }

    userModel.buscarPorEmail(email, (erro, usuario) => {
        if (erro) {
            console.log("Erro ao consultar usuário:", erro.code)

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível verificar o código." })
        }

        if (!usuario) {

            // status 400 - requisição inválida
            return res.status(400).json({ erro: mensagemInvalida })
        }

        // considera somente a solicitação mais recente dessa conta
        recuperacaoModel.buscarUltimaRecuperacao(usuario.user_id, (erro, recuperacao) => {
            if (erro) {
                console.log("Erro ao consultar recuperacao:", erro.code)

                // status 500 - erro interno do servidor
                return res.status(500).json({ erro: "Não foi possível verificar o código." })
            }

            if (!recuperacao || recuperacao.rec_usado !== 0) {

                // status 400 - requisição inválida
                return res.status(400).json({ erro: mensagemInvalida })
            }

            // converte a expiração para comparar com o horário atual
            const expiracao = new Date(recuperacao.rec_expiracao).getTime()

            if (!Number.isFinite(expiracao) || expiracao <= Date.now()) {
                
                // status 400 - requisição inválida
                return res.status(400).json({ erro: mensagemInvalida })
            }

            // compara o código recebido com o hash salvo no banco
            bcrypt.compare(codigo, recuperacao.rec_codigo, (erro, codigoCorreto) => {
                if (erro) {
                    console.log("Erro ao comparar código:", erro.message)

                    // status 500 - erro interno do servidor
                    return res.status(500).json({ erro: "Não foi possível verificar o código." })
                }

                if (!codigoCorreto || expiracao <= Date.now()) {

                    // status 400 - requisição inválida
                    return res.status(400).json({ erro: mensagemInvalida })
                }

                // cria uma nova sessão antes de guardar a autorização de recuperação
                req.session.regenerate((erro) => {
                    if (erro) {

                        // status 500 - erro interno do servidor
                        return res.status(500).json({ erro: "Não foi possível iniciar a recuperação." })
                    }

                    req.session.recuperacao = {
                        recId: recuperacao.rec_id,
                        userId: usuario.user_id,
                        email: usuario.user_email,
                        expiracao: expiracao
                    }

                    // salva a autorização antes de liberar o próximo passo no navegador
                    req.session.save((erro) => {
                        if (erro) {
                            delete req.session.recuperacao

                            // status 500 - erro interno do servidor
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

// recebe a nova senha e sua confirmação e usa a autorização guardada na sessão
// solicita a atualização ao model, encerra a sessão atual e responde em json
function redefinirSenha(req, res) {
    res.set("Cache-Control", "no-store")

    if (!req.is("application/json")) {

        // status 415 - formato não aceito
        return res.status(415).json({ erro: "Envie os dados em formato JSON." })
    }

    const dados = req.body || {}
    const recuperacao = req.session.recuperacao

    if (!recuperacao || !Number.isFinite(recuperacao.expiracao) || recuperacao.expiracao <= Date.now()) {
        delete req.session.recuperacao

        // status 401 - autenticação ausente ou inválida
        return res.status(401).json({ erro: "Solicite e valide um novo código de recuperação." })
    }

    const erroSenha = usuarioValidacao.validarSenha(dados.senha, dados.confirmarSenha)

    if (erroSenha) {

        // status 400 - requisição inválida
        return res.status(400).json({ erro: erroSenha })
    }

    // manda o model conferir novamente a validade e alterar a senha
    recuperacaoModel.concluirRecuperacao(recuperacao, dados.senha, (erro, resultado) => {
        if (erro) {
            console.log("Erro ao redefinir senha:", erro.code)

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível alterar a senha. Tente novamente." })
        }

        // mostra que nenhuma recuperação disponível permitiu atualizar a senha
        if (resultado.affectedRows === 0) {
            delete req.session.recuperacao

            // status 409 - conflito nos dados
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