const express = require('express')
const router = express.Router()

const conteudoController = require("../controller/conteudoController")

router.get("/:categoria/:topico", conteudoController.buscarConteudo)

module.exports = router