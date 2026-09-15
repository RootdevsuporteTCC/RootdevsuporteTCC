const express = require('express')
const router = express.Router()

const conteudoController = require("../controller/conteudoController")

router.get("/pesquisa", conteudoController.pesquisarConteudos)

router.get("/:categoria", conteudoController.listarTopicos)
router.get("/:categoria/:topico", conteudoController.buscarConteudo)

module.exports = router