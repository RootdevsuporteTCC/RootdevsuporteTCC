const express = require('express')
const router = express.Router()

const userController = require('../controller/userController')

router.post('/cadastro', userController.criarUsuario)
router.post('/login', userController.loginUsuario)
router.get('/sessao', userController.verificarSessao)
router.post('/logout', userController.logoutUsuario)
router.get("/perfil", userController.buscarPerfil)

module.exports = router