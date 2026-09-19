const express = require("express")
const router = express.Router()

const { rateLimit } = require("express-rate-limit")

const comentarioController = require("../controller/comentarioController")

const limitarComentarios = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    skip: (req) => {
        return !req.session.usuario
    },

    keyGenerator: (req) => {
        return String(req.session.usuario.id)
    },

    message: {
        erro: "Você enviou muitas solicitações. Aguarde um minuto antes de comentar novamente."
    }
})

router.post("/", limitarComentarios, comentarioController.salvarComentario)
router.delete("/:id", comentarioController.excluirComentario)

module.exports = router