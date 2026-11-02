// recebe os erros encaminhados por next e define a resposta ao navegador
function tratarErros(erro, req, res, next) {
    
    // encaminha o erro sem iniciar outra resposta quando os cabeçalhos já foram enviados
    if (res.headersSent) {
        return next(erro)
    }

    // trata o json que não pôde ser lido pelo servidor
    if (erro.type === "entity.parse.failed") {
        return res.status(400).json({ erro: "Os dados enviados estão em um formato JSON inválido." })
    }

    // trata o corpo da requisição acima do tamanho permitido
    if (erro.status === 413) {
        return res.status(413).json({ erro: "Os dados enviados ultrapassam o tamanho permitido." })
    }

    console.log("Erro interno:", erro.code || erro.name)

    // responde sem expor os detalhes do erro interno ao navegador
    return res.status(500).json({
        erro: "Erro interno do servidor. Tente novamente."
    })
}

module.exports = tratarErros