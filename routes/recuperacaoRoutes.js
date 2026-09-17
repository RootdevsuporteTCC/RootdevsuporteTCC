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

router.post("/solicitar", limitarPorIp, limitarPorEmail, recuperacaoController.solicitarRecuperação)

module.exports = router