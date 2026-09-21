const express = require('express')
const router = express.Router()

const conteudoController = require("../controller/conteudoController")

// roda que faz a pesquisa (precisa vir antes das outras rotas, 
// pois a rota de categoria usa a mesma posição mas com uma rota variável)
router.get("/pesquisa", conteudoController.pesquisarConteudos)

// manda a pesquisa antes que seu endereço seja interpretado como categoria
router.get("/:categoria", conteudoController.listarTopicos)

// manda categoria e tópico para consultar a aula e os comentários
router.get("/:categoria/:topico", conteudoController.buscarConteudo)

module.exports = router