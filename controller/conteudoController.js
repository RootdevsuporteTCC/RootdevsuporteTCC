const fs = require("fs")
const path = require("path")

const comentarioModel = require('../model/comentarioModel')

function buscarConteudo(req, res) {
    const categoria = req.params.categoria
    const topico = req.params.topico

    //regex que permite apenas caracteres como 'a' a 'z', 'A' a 'Z', '0' a '9', '_' e '-'
    const nomeValido = /^[a-zA-Z0-9_-]+$/ 

    if (
        !categoria ||
        !topico || 
        !nomeValido.test(categoria) ||
        !nomeValido.test(topico)
    ) {
        return res.status(400).json({ erro: "Categoria ou tópico inválido" })
    }

    const caminhoArquivo = path.join(__dirname, "../content/aulas", categoria, `${topico}.md`)

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