const fs = require("fs")
const path = require("path")

const comentarioModel = require("../model/comentarioModel")

function salvarComentario(req, res) {
    if (!req.session.usuario) {
        return res.status(401).json({ erro: "Faça login para comentar." })
    }

    const dados = req.body || {}

    const categoria = dados.categoria
    const topico = dados.topico

    if (categoria !== "html" && categoria !== "css" && categoria !== "javascript") {
        return res.status(400).json({ erro: "Categoria inválida." })
    }

    const nomeValido = /^[a-zA-Z0-9_-]+$/

    if (!nomeValido.test(topico)) {
        return res.status(400).json({ erro: "Tópico inválido." })
    }
    
    const texto = dados.texto.trim()
    if (texto.length === 0 || texto.length > 1000) {
        return res.status(400).json({ erro: "O comentário deve ter entre 1 e 1000 caracteres" })
    }

    const caminhoArquivo = path.join(__dirname, "../content", categoria, `${topico}.md`)

    fs.stat(caminhoArquivo, (erroArquivo, arquivo) => {
        if (erroArquivo) {
            if (erroArquivo.code === "ENOENT") {
                return res.status(404).json({ erro: "Aula não encontrada" })
            }

            console.log("Erro ao verificar a aula:", erroArquivo)

            return res.status(500).json({ erro: "Não foi possível verificar a aula." })
        }

        if (!arquivo.isFile()) {
            return res.status(404).json({ erro: "Aula não encontrada." })
        }

        const comentario = {
            userId: req.session.usuario.id,
            texto: texto,
            categoria: categoria,
            topico: topico
        }

        comentarioModel.salvarComentario(comentario, (erro, resultado) => {
            if (erro) {
                console.log("Erro ao salvar comentário:", erro)

                return res.status(500).json({ erro: "Não foi possível salvar o comentário." })
            }

            if (resultado.affectedRows !== 1) {
                return res.status(500).json({ erro: "O comentário não foi salvo." })
            }

            return res.status(201).json({ mensagem: "Comentário salvo." })
        })
    })
}

function excluirComentario(req, res) {
    if (!req.session.usuario) {
        return res.status(401).json({ erro: "Faça login para excluir um comentário." })
    }

    const id = Number(req.params.id)

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "ID do comentário inválido." })
    }

    const comentario = {
        id: id,
        userId: req.session.usuario.id
    }

    comentarioModel.excluirComentario(comentario, (erro, resultado) => {
        if (erro) {
            console.log("Erro ao excluir comentário:", erro)

            return res.status(500).json({ erro: "Não foi possível excluir o comentario" })
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Comentario não encontrado ou não pertence a você." })
        }

        return res.json({ mensagem: "Comentário excluido." })
    })
}

module.exports = {
    salvarComentario,
    excluirComentario
}