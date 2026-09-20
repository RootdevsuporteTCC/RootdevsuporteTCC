const express = require('express')
const router = express.Router()

const admController = require('../controller/admController')
const verificarAdmin = require('../middleware/verificarAdmin')

router.post('/', admController.loginAdm) // envia as credenciais para verificar o login do admin
router.get('/painel', verificarAdmin, admController.enviarPainel) // verifica o acesso antes de enviar a página do painel
router.get("/admin.js", verificarAdmin, admController.enviarAdminJs) // verifica o acesso antes de enviar o script do painel

// protege as rotas de consulta e manutenção dos usuários
router.get("/usuarios", verificarAdmin, admController.buscarUsuarios) 
router.get("/usuarios/:id", verificarAdmin, admController.buscarUsuarioPorId)
router.delete("/usuarios/:id", verificarAdmin, admController.excluirUsuario)
router.put("/usuarios/:id", verificarAdmin, admController.atualizarUsuario)

// protege as rotas de consulta e exclusão dos comentários
router.get('/comentarios', verificarAdmin, admController.buscarComentarios)
router.delete('/comentarios/:id', verificarAdmin, admController.excluirComentarioAdmin)

// permite ao administrador consultar os logs registrados
router.get("/logs", verificarAdmin, admController.buscarLogs)

module.exports = router