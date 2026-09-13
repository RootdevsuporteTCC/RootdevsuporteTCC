const express = require("express")
const router = express.Router()

const comentarioController = require("../controller/comentarioController")

router.post("/", comentarioController.salvarComentario)
router.delete("/:id", comentarioController.excluirComentario)

module.exports = router