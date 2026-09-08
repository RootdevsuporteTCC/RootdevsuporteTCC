const express = require('express')
const router = express.Router()

const admController = require('../controller/admController')
const verificarAdmin = require('../middleware/verificarAdmin')

router.post('/', admController.loginAdm)
router.get('/painel', verificarAdmin, admController.enviarPainel)
router.get("/admin.js", verificarAdmin, admController.enviarAdminJs)
router.get("/usuarios", verificarAdmin, admController.buscarUsuarios)
router.get("/usuarios/:id", verificarAdmin, admController.buscarUsuarioPorId)
router.delete("/usuarios/:id", verificarAdmin, admController.excluirUsuario)
router.put("/usuarios/:id", verificarAdmin, admController.atualizarUsuario)

module.exports = router