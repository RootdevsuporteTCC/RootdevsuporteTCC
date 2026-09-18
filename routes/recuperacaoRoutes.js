const express = require('express')
const router = express.Router()

const { rateLimit } = require("express-rate-limit")

const recuperacaoController = require("../controller/recuperacaoController")


const limitarPorIp = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        erro: "Muitas solicitações. Aguarde alguns minutos e tente novamente."
    }
})

const limitarPorEmail = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    skip: (req) => {
        const dados = req.body || {}

        if (typeof dados.email !== "string") {
            return true
        }

        const email = dados.email.trim()

        return email.length === 0 || email.length > 254
    },

    keyGenerator: (req) => {
        return req.body.email.trim().toLowerCase()
    },

    message: {
        erro: "Limite de solicitações para esse e-mail atingido. Aguarde alguns minutos."
    }
})

const limitarVerificacaoPorIp = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        erro: "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    }
})

const limitarVerificacaoPorEmail = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    skip: (req) => {
        const dados = req.body || {}

        if (typeof dados.email !== "string") {
            return true
        }

        const email = dados.email.trim()

        return email.length === 0 || email.length > 254
    },

    keyGenerator: (req) => {
        return req.body.email.trim().toLowerCase()
    },

    message: {
        erro: "Muitas tentativas para este e-mail. Aguarde alguns minutos antes de tentar novamente."
    }
})

const limitarRedefinicao = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        erro: "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    }
})

router.post("/solicitar", limitarPorIp, limitarPorEmail, recuperacaoController.solicitarRecuperacao)
router.post("/verificar", limitarVerificacaoPorIp, limitarVerificacaoPorEmail, recuperacaoController.verificarCodigo)
router.post("/redefinir", limitarRedefinicao, recuperacaoController.redefinirSenha)

module.exports = router