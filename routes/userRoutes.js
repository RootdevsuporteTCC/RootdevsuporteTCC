const express = require('express')
const router = express.Router()
const { rateLimit } = require("express-rate-limit")

const userController = require('../controller/userController')

// limita o cadastro a 10 tentativas por ip a cada 5 minutos
const limitarCadastro = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        erro: "Muitas tentativas de cadastro. Aguarde 5 minutos antes de tentar novamente."
    }
})

// limita 10 tentativas por ip em 15 minutos entre edição e exclusão do perfil
const limitarEdicaoPerfil = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        erro: "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    }
})

// rotas
router.post('/cadastro', limitarCadastro, userController.criarUsuario) // recebe o cadastro e aplica o limite antes de mandar ao controller
router.post('/login', userController.loginUsuario) // manda os dados de login para autenticação
router.get('/sessao', userController.verificarSessao) // manda a consulta da sessão para devolver o estado do login
router.post('/logout', userController.logoutUsuario) // manda a solicitação de encerramento da sessão
router.get('/perfil', userController.buscarPerfil) // manda a consulta dos dados do usuário conectado
router.post('/perfil', limitarEdicaoPerfil, userController.atualizarPerfil) // limita as tentativas antes de mandar a edição do perfil
router.delete('/perfil', limitarEdicaoPerfil, userController.excluirPerfil) // limita as tentativas antes de encaminhar a exclusão do perfil

module.exports = router