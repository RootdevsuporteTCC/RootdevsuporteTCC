const express = require("express")
const router = express.Router()

const conteudoController = require("../controller/conteudoController")

// deve vir antes de /:categoria para "pesquisa" não ser tratada como categoria
router.get("/pesquisa", conteudoController.pesquisarConteudos)

// lista os topicos da categoria solicitada
router.get("/:categoria", conteudoController.listarTopicos)

// busca a aula e seus comentários
router.get("/:categoria/:topico", conteudoController.buscarConteudo)

module.exports = router