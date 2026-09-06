const express = require('express')
const router = express.Router()

const admController = require('../controller/admController')
const verificarAdmin = require('../middleware/verificarAdmin')

router.post('/', admController.loginAdm)
router.get('/painel', verificarAdmin, admController.mostrarPainel)
router.get("/admin.js", verificarAdmin, admController.enviarAdminJs)

module.exports = router