const express = require("express")
const router = express.Router()

const { rateLimit } = require("express-rate-limit")

const comentarioController = require("../controller/comentarioController")

// limita a publicação a cinco tentativas por minuto para cada usuário conectado
const limitarComentarios = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8", // define o cabeçalho padronizado como "draft-8"
    legacyHeaders: false, // esativa os cabeçalhos antigos que a biblioteca usava

    // deixa o controller recusar visitantes sem aplicar a contagem por usuário
    skip: (req) => {
        return !req.session.usuario
    },

    // usa o id da sessão para identificar o contador de tentativas
    keyGenerator: (req) => {
        return String(req.session.usuario.id)
    },

    message: {
        erro: "Você enviou muitas solicitações. Aguarde um minuto antes de comentar novamente."
    }
})

// rotas
router.post("/", limitarComentarios, comentarioController.salvarComentario) // aplica o limite e encaminha os dados do comentário pra salvar
router.delete("/:id", comentarioController.excluirComentario) // encaminha o id do comentário para verificar o autor dele e excluir

module.exports = router