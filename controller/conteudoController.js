const fs = require("fs")
const path = require("path")

const comentarioModel = require('../model/comentarioModel')

function buscarConteudo(req, res) {
    const categoria = req.params.categoria
    const topico = req.params.topico

    if (
        categoria !== "html" &&
        categoria !== "css" &&
        categoria !== "javascript"
    ) {
        return res.status(400).json({ erro: "Categoria inválida" })
    }

    //regex que permite apenas letras, numeros, hifen e underline
    const nomeValido = /^[a-zA-Z0-9_-]+$/ 

    if (!topico || !nomeValido.test(topico)) {
        return res.status(400).json({ erro: "Tópico inválido" })
    }

    const caminhoArquivo = path.join(__dirname, "../content", categoria, `${topico}.md`)

    fs.readFile(caminhoArquivo, "utf8", (erro, conteudo) => {
        if (erro) {
            console.log(erro)
            return res.status(404).json({ erro: "Conteúdo não encontrado" })
        }

        comentarioModel.buscarPorTopico(categoria, topico, (erro, comentarios) => {
            if (erro) {
                console.log(erro)

                return res.status(500).json({ erro: "Erro ao buscar comentários" })
            }

            return res.status(200).json({
                conteudo: conteudo,
                comentarios: comentarios
            })
        })
    })
}

module.exports = {
    buscarConteudo
}