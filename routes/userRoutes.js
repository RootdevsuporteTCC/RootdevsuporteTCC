const express = require('express')
const router = express.Router()

const userController = require('../controller/userController')

router.post('/', userController.criarUsuario)

module.exports = router