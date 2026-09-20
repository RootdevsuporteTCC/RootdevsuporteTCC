const fs = require("fs")
const path = require("path")

const comentarioModel = require("../model/comentarioModel")
const logModel = require("../model/logModel")

// recebe texto, categoria e tópico e identifica o autor pela sessão
// valida a aula, salva pelo model, registra a ação e responde em json
function salvarComentario(req, res) {
    if (!req.session.usuario) {

        // status 401 - autenticação ausente ou inválida
        return res.status(401).json({ erro: "Faça login para comentar." })
    }

    const dados = req.body || {}

    const categoria = dados.categoria
    const topico = dados.topico

    if (categoria !== "html" && categoria !== "css" && categoria !== "javascript") {
        
        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Categoria inválida." })
    }

    const nomeValido = /^[a-zA-Z0-9_-]+$/

    if (!nomeValido.test(topico)) {

        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Tópico inválido." })
    }
    
    const texto = dados.texto.trim()
    if (texto.length === 0 || texto.length > 1000) {

        // status 400 - requisição inválida
        return res.status(400).json({ erro: "O comentário deve ter entre 1 e 1000 caracteres" })
    }

    const caminhoArquivo = path.join(__dirname, "../content", categoria, `${topico}.md`)

    // verifica no servidor se o arquivo da aula existe antes de aceitar o comentário
    fs.stat(caminhoArquivo, (erroArquivo, arquivo) => {
        if (erroArquivo) {
            if (erroArquivo.code === "ENOENT") {

                // status 404 - recurso não encontrado
                return res.status(404).json({ erro: "Aula não encontrada" })
            }

            console.log("Erro ao verificar a aula:", erroArquivo)

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível verificar a aula." })
        }

        if (!arquivo.isFile()) {

            // status 404 - recurso não encontrado
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

                // status 500 - erro interno do servidor
                return res.status(500).json({ erro: "Não foi possível salvar o comentário." })
            }

            if (resultado.affectedRows !== 1) {

                // status 500 - erro interno do servidor
                return res.status(500).json({ erro: "O comentário não foi salvo." })
            }

            const log = {
                userId: req.session.usuario.id,
                acao: `Comentario publicado. ID: ${resultado.insertId}`
            }

            return logModel.registrarLog(log, (erroLog) => {
                if (erroLog) {
                    console.log("Erro ao registrar a publicação:", erroLog)
                }

                // status 201 - registro criado
                return res.status(201).json({ mensagem: "Comentário salvo." })
            })
        })
    })
}

// recebe o id pela rota e o autor pela sessão
// solicita a exclusão ao model, registra a ação e responde em json
function excluirComentario(req, res) {
    if (!req.session.usuario) {

        // status 401 - autenticação ausente ou inválida
        return res.status(401).json({ erro: "Faça login para excluir um comentário." })
    }

    const id = Number(req.params.id)

    if (!Number.isSafeInteger(id) || id <= 0) {
        
        // status 400 - requisição inválida
        return res.status(400).json({ erro: "ID do comentário inválido." })
    }

    const comentario = {
        id: id,
        userId: req.session.usuario.id
    }

    // envia os dois ids para que a exclusão confira também o autor
    comentarioModel.excluirComentario(comentario, (erro, resultado) => {
        if (erro) {
            console.log("Erro ao excluir comentário:", erro)

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível excluir o comentario" })
        }

        if (resultado.affectedRows === 0) {

            // status 404 - recurso não encontrado
            return res.status(404).json({ erro: "Comentario não encontrado ou não pertence a você." })
        }

        const log = {
            userId: req.session.usuario.id,
            acao: `Comentário excluído pelo autor. ID: ${id}`
        }

        return logModel.registrarLog(log, (erroLog) => {
            if (erroLog) {
                console.log("Erro ao registrar a exclusão:", erroLog)
            }

            return res.json({ mensagem: "Comentário excluido." })
        })
    })
}

module.exports = {
    salvarComentario,
    excluirComentario
}