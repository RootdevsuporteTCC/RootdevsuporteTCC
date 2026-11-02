const crypto = require("crypto")

const { compararHash } = require("../service/criptografiaService")
const recuperacaoService = require("../service/recuperacaoService")

const { encerrarSessao } = require("../utils/sessao")

const userModel = require("../model/userModel")
const recuperacaoModel = require("../model/recuperacaoModel")
const logModel = require("../model/logModel")
const emailService = require("../service/emailService")
const usuarioValidacao = require("../validacoes/usuarioValidacao")

// recebe o email e responde com uma mensagem genérica de solicitação
// salva a recuperação e tenta enviar o código quando a conta existe
    function solicitarRecuperacao(req, res) {
    
    // usa um objeto vazio se req.body retornar qualquer valor "falsy"
    const dados = req.body || {}

    if (typeof dados.email !== "string") {
        return res.status(400).json({ erro: "Informe um e-mail válido." })
    }

    const email = dados.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // verifica o formato básico do email

    if (email.length > 254 || !emailRegex.test(email)) {
        return res.status(400).json({ erro: "Informe um e-mail válido." })
    }

    // gera um código aleatório com oito caracteres hexadecimais
    const codigo = crypto.randomBytes(4).toString("hex").toUpperCase()

    // responde sem revelar se o email pertence a uma conta cadastrada
    res.status(202).json({ mensagem: "Solicitação recebida. Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação." })

    // continua o processamento após a resposta sem confirmar a entrega do email
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

        recuperacaoService.criarRecuperacao(recuperacao, (erro) => {
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

    // usa um objeto vazio se req.body retornar qualquer valor "falsy"
    const dados = req.body || {}

    const mensagemInvalida = "Código inválido ou expirado"

    res.set("Cache-control", "no-store") // impede o reaproveitamento da resposta pelo navegador

    // remove uma autorização anterior antes de verificar outro código
    delete req.session.recuperacao

    if (typeof dados.email !== "string" || typeof dados.codigo !== "string") {
        return res.status(400).json({ erro: mensagemInvalida })
    }

    const email = dados.email.trim()
    const codigo = dados.codigo.trim().toUpperCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // verifica o formato básico do email

    // confere o formato do email e exige um código com oito caracteres hexadecimais
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

        // considera somente a solicitação mais recente dessa conta
        recuperacaoModel.buscarUltimaRecuperacao(usuario.user_id, (erro, recuperacao) => {
            if (erro) {
                console.log("Erro ao consultar recuperacao:", erro.code)

                return res.status(500).json({ erro: "Não foi possível verificar o código." })
            }

            // exige uma recuperação não usada e dentro do prazo calculado pelo banco
            if (!recuperacao || recuperacao.rec_usado !== 0 || recuperacao.rec_valida !== 1) {
                return res.status(400).json({ erro: mensagemInvalida })
            }

            compararHash(codigo, recuperacao.rec_codigo, (erro, codigoCorreto) => {
                if (erro) {
                    console.log("Erro ao comparar código:", erro.message)

                    return res.status(500).json({ erro: "Não foi possível verificar o código." })
                }

                if (!codigoCorreto) {
                    return res.status(400).json({ erro: mensagemInvalida })
                }

                // cria uma nova sessão antes de guardar a autorização de recuperação
                req.session.regenerate((erro) => {
                    if (erro) {
                        return res.status(500).json({ erro: "Não foi possível iniciar a recuperação." })
                    }

                    req.session.recuperacao = {
                        recId: recuperacao.rec_id,
                        userId: usuario.user_id,
                        email: usuario.user_email
                    }

                    // salva a autorização antes de liberar o próximo passo no navegador
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

// recebe a nova senha e sua confirmação e usa a autorização guardada na sessão
// altera a senha pelo service e encerra a sessão da recuperação
function redefinirSenha(req, res) {
    res.set("Cache-Control", "no-store") // impede o reaproveitamento da resposta pelo navegador

    if (!req.is("application/json")) {
        return res.status(415).json({ erro: "Envie os dados em formato JSON." })
    }

    // usa um objeto vazio se req.body retornar qualquer valor "falsy"
    const dados = req.body || {}
    
    const recuperacao = req.session.recuperacao

    if (!recuperacao) {
        delete req.session.recuperacao

        return res.status(401).json({ erro: "Solicite e valide um novo código de recuperação." })
    }

    const erroSenha = usuarioValidacao.validarSenha(dados.senha, dados.confirmarSenha)

    if (erroSenha) {
        return res.status(400).json({ erro: erroSenha })
    }

    // o service prepara o hash e o model confere a validade antes de alterar a senha
    recuperacaoService.concluirRecuperacao(recuperacao, dados.senha, (erro, resultado) => {
        if (erro) {
            console.log("Erro ao redefinir senha:", erro.code)

            return res.status(500).json({ erro: "Não foi possível alterar a senha. Tente novamente." })
        }

        // remove a autorização quando a recuperação não permite mais alterar a senha
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

        encerrarSessao(req, res, (erroSessao) => {
            if (erroSessao) {
                console.log("Erro ao encerrar sessão de recuperação:", erroSessao.message)
            }

            return res.json({ mensagem: "Senha alterada com sucesso. Faça login com sua nova senha." })
        })
    })
}

module.exports = {
    solicitarRecuperacao,
    verificarCodigo,
    redefinirSenha
}