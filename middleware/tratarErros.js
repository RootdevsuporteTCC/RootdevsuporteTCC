function tratarErros(erro, req, res, next) {
    if (res.headersSent) {
        return next(erro)
    }

    if (erro.type === "entity.parse.failed") {
        return res.status(400).json({ erro: "Os dados enviados estão em um formato JSON inválido." })
    }

    if (erro.status === 413) {
        return res.status(413).json({ erro: "Os dados enviados ultrapassam o tamanho permitido." })
    }

    console.log("Erro interno:", erro.code || erro.name)

    return res.status(500).json({
        erro: "Erro interno do servidor. Tente novamente."
    })
}

module.exports = tratarErros