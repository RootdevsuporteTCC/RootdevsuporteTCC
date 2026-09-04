const express = require('express')
const router = express.Router()

const admController = require('../controller/admController')

router.post('/', admController.loginAdm)

module.exports = router