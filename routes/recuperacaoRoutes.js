const express = require('express')
const router = express.Router()

const { rateLimit } = require("express-rate-limit")

const recuperacaoController = require("../controller/recuperacaoController")

// limita a solicitação de códigos a 10 tentativas por ip em 15 minutos
const limitarPorIp = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8", // define o cabeçalho padronizado como "draft-8"
    legacyHeaders: false, // desativa os cabeçalhos antigos que a biblioteca usava
    message: {
        erro: "Muitas solicitações. Aguarde alguns minutos e tente novamente."
    }
})

// limita a solicitação de códigos a 3 tentativas por email em 15 minutos
const limitarPorEmail = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    standardHeaders: "draft-8", // define o cabeçalho padronizado como "draft-8"
    legacyHeaders: false, // desativa os cabeçalhos antigos que a biblioteca usava

    // pula a contagem por email quando o valor não pode ser usado como identificador
    skip: (req) => {
        const dados = req.body || {}

        if (typeof dados.email !== "string") {
            return true
        }

        const email = dados.email.trim()

        return email.length === 0 || email.length > 254
    },

    // padroniza o email recebido para identificar o contador de tentativas
    keyGenerator: (req) => {
        return req.body.email.trim().toLowerCase()
    },

    message: {
        erro: "Limite de solicitações para esse email atingido. Aguarde alguns minutos."
    }
})

// limita a verificação de códigos a 20 tentativas por ip em 15 minutos
const limitarVerificacaoPorIp = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        erro: "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    }
})

// limita a verificação a 5 tentativas por email em 15 minutos
const limitarVerificacaoPorEmail = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false, // desativa os cabeçalhos antigos que a biblioteca usava

    // pula a contagem por email quando o valor não pode ser usado como identificador
    skip: (req) => {
        const dados = req.body || {}

        if (typeof dados.email !== "string") {
            return true
        }

        const email = dados.email.trim()

        return email.length === 0 || email.length > 254
    },

    // padroniza o e-mail recebido para identificar o contador de tentativas
    keyGenerator: (req) => {
        return req.body.email.trim().toLowerCase()
    },

    message: {
        erro: "Muitas tentativas para este e-mail. Aguarde alguns minutos antes de tentar novamente."
    }
})

// limita a redefinição a 10 tentativas por ip em 15 minutos
const limitarRedefinicao = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        erro: "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    }
})

// aplica os limites antes de mandar a solicitação do código
router.post("/solicitar", limitarPorIp, limitarPorEmail, recuperacaoController.solicitarRecuperacao)     

// aplica os limites antes de mandar o email e o código para verificação
router.post("/verificar", limitarVerificacaoPorIp, limitarVerificacaoPorEmail, recuperacaoController.verificarCodigo) 

// aplica o limite antes de mandar a nova senha e sua confirmação
router.post("/redefinir", limitarRedefinicao, recuperacaoController.redefinirSenha)                                   

module.exports = router