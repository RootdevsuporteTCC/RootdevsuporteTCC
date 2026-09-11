const fs = require("fs")
const path = require("path")

const comentarioModel = require('../model/comentarioModel')

function extrairMetadados(texto) {
    const linhas = texto.split("\n")

    if (linhas[0].trim() !== "---") {
        return null
    }

    let categoria = ""
    let topico = ""
    let fimCabecalho = -1

    for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        
        if (linha === "---") {
            fimCabecalho = i
            break
        }

        if (linha.startsWith("categoria:")) {
            categoria = linha.replace("categoria:", "").trim()
        }

        if (linha.startsWith("topico:")) {
            topico = linha.replace("topico:", "").trim()
        }
    }

    if (fimCabecalho === -1 || categoria === "" || topico === "") {
        return null
    }

    const conteudo = linhas.slice(fimCabecalho + 1).join("\n")

    return {
        categoria: categoria,
        topico: topico,
        conteudo: conteudo
    }
}

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

    fs.readFile(caminhoArquivo, "utf8", (erroArquivo, conteudo) => {
        if (erroArquivo) {
            if (erroArquivo.code === "ENOENT") {
                return res.status(404).json({ erro: "Aula não encontrada" })
            }
            console.log("Erro ao ler a aula:", erroArquivo)

            return res.status(500).json({ erro: "Não foi possível ler a aula" })
        }


        const aula = extrairMetadados(conteudo)

        if (aula === null) {
            return res.status(500).json({ erro: "O cabeçalho da aula está incompleto ou incorreto" })
        }

        if (aula.categoria !== categoria || aula.topico !== topico) {
            return res.status(500).json({ erro: "O cabeçalho não corresponde à pasta e ao nome da aula" })
        }


        comentarioModel.buscarPorTopico(categoria, topico, (erroComentario, comentarios) => {
            if (erroComentario) {
                console.log("Erro ao buscar comentários:", erroComentario)

                return res.status(500).json({ erro: "Não foi possível buscar os comentários" })
            }

            return res.status(200).json({
                conteudo: aula.conteudo,
                comentarios: comentarios
            })
        })
    })
}

module.exports = {
    buscarConteudo
}