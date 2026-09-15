const fs = require("fs")
const path = require("path")

const comentarioModel = require('../model/comentarioModel')
const logModel = require("../model/logModel")

const cacheConteudos = []

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

function carregarCacheConteudos() {
    cacheConteudos.length = 0

    const categorias = ["html", "css", "javascript"]

    categorias.forEach((categoria) => {
        const pasta = path.join(__dirname, "../content", categoria)

        const arquivos = fs.readdirSync(pasta, { withFileTypes: true })

        arquivos.forEach((arquivo) => {
            if (!arquivo.isFile() || !arquivo.name.endsWith(".md")) {
                return
            }

            const topico = path.basename(arquivo.name, ".md")

            if (!/^[a-zA-Z0-9_-]+$/.test(topico)) {
                console.log("Nome de tópico inválido:", arquivo.name)
                return
            }

            const caminhoArquivo = path.join(pasta, arquivo.name)
            const texto = fs.readFileSync(caminhoArquivo, "utf8")

            const aula = extrairMetadados(texto)

            if (aula === null) {
                console.log("Cabeçalho inválido:", caminhoArquivo)
                return
            }

            if (aula.categoria !== categoria || aula.topico !== topico) {
                console.log("Cabeçalho diferente da pasta ou arquivo:", caminhoArquivo)
                return
            }

            cacheConteudos.push(aula)
        })
    })
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

            comentarios.forEach((comentario) => {
                comentario.podeExcluir = false

                if (req.session.usuario) {
                    comentario.podeExcluir = Number(comentario.com_user_id) === Number(req.session.usuario.id)
                }
            })

            return res.status(200).json({
                conteudo: aula.conteudo,
                comentarios: comentarios
            })
        })
    })
}

function listarTopicos(req, res) {
    const categoria = req.params.categoria

    if (categoria !== "html" && categoria !== "css" && categoria !== "javascript") {
        return res.status(400).json({ erro: "Categoria inválida" })
    }

    const pasta = path.join(__dirname, "../content", categoria)

    fs.readdir(pasta, { withFileTypes: true }, (erro, arquivos) => {
        if (erro) {
            if (erro.code === "ENOENT") {
                return res.json({ topicos: [] })
            }

            console.log("Erro ao listar tópicos:", erro)

            return res.status(500).json({ erro: "Não foi possível listar os tópicos" })
        }

        const topicos = []

        arquivos.forEach((arquivo) => {
            if (arquivo.isFile() && arquivo.name.endsWith(".md")) {
                const topico = path.basename(arquivo.name, ".md")

                topicos.push(topico)
            }
        })

        topicos.sort()

        return res.json({ topicos: topicos })
    })
}

function pesquisarConteudos(req, res) {
    const pesquisa = req.query.pesquisa || ""

    if (typeof pesquisa !== "string") {
        return res.status(400).json({ erro: "Pesquisa inválida" })
    }

    const termo = pesquisa.trim().toLowerCase()

    if (termo.length > 100) {
        return res.status(400).json({ erro: "A pesquisa deve ter até 100 caracteres" })
    }

    if (termo === "") {
        return res.json({ resultados: [] })
    }

    const resultados = []

    cacheConteudos.forEach((aula) => {
        const categoria = aula.categoria.toLowerCase()
        const topico = aula.topico.toLowerCase()
        const conteudo = aula.conteudo.toLowerCase()

        if (categoria.includes(termo) || topico.includes(termo) || conteudo.includes(termo)) {
            resultados.push({
                categoria: aula.categoria,
                topico: aula.topico
            })
        }
    });

    let userId = null

    if (req.session.usuario) {
        userId = req.session.usuario.id
    }

    const log = {
        userId: userId,
        acao: "Pesquisa de conteúdos realizada"
    }

    logModel.registrarLog(log, (erroLog) => {
        if (erroLog) {
            console.log("Erro ao registrar a pesquisa:", erroLog)
        }

        return res.json({ resultados: resultados })
    })
}

module.exports = {
    buscarConteudo,
    listarTopicos,
    carregarCacheConteudos,
    pesquisarConteudos
}