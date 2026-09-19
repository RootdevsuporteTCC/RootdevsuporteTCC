const express = require('express')
const router = express.Router()
const { rateLimit } = require("express-rate-limit")

const limitarEdicaoPerfil = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        erro: "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    }
})

const userController = require('../controller/userController')

router.post('/cadastro', userController.criarUsuario)
router.post('/login', userController.loginUsuario)
router.get('/sessao', userController.verificarSessao)
router.post('/logout', userController.logoutUsuario)
router.get("/perfil", userController.buscarPerfil)
router.post("/perfil", limitarEdicaoPerfil, userController.atualizarPerfil)

module.exports = router