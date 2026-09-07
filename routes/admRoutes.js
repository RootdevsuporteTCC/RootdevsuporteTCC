const express = require('express')
const router = express.Router()

const admController = require('../controller/admController')
const verificarAdmin = require('../middleware/verificarAdmin')

router.post('/', admController.loginAdm)
router.get('/painel', verificarAdmin, admController.mostrarPainel)
router.get("/admin.js", verificarAdmin, admController.enviarAdminJs)
router.get("/usuarios", verificarAdmin, admController.buscarUsuarios)
router.delete("/usuarios/:id", verificarAdmin, admController.excluirUsuario)

module.exports = router