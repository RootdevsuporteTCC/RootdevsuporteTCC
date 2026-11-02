const fs = require("fs")
const path = require("path")

const comentarioModel = require('../model/comentarioModel')

// guarda as aulas na memória para listar tópicos abrir conteúdos e pesquisar
const cacheConteudos = []

// separa o cabeçalho do texto da aula e retorna null quando ele é inválido
function extrairMetadados(texto) {
    const linhas = texto.split("\n")

    // verifica se o arquivo tem cabeçalho
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

    // separa o texto da aula das linhas do cabeçalho
    const conteudo = linhas.slice(fimCabecalho + 1).join("\n")

    return {
        categoria: categoria,
        topico: topico,
        conteudo: conteudo
    }
}

// carrega as aulas válidas no cache durante a inicialização do servidor
function carregarCacheConteudos() {
    cacheConteudos.length = 0

    const categorias = ["html", "css", "javascript"]

    categorias.forEach((categoria) => {
        const pasta = path.join(__dirname, "../content", categoria)

        // conclui a leitura das pastas antes de iniciar o servidor
        const arquivos = fs.readdirSync(pasta, { withFileTypes: true })

        arquivos.forEach((arquivo) => {
            if (!arquivo.isFile() || !arquivo.name.endsWith(".md")) {
                return
            }

            const topico = path.basename(arquivo.name, ".md")

            // aceita apenas letras sem acento números hífen e underline
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

            // ignora a aula quando o cabeçalho não corresponde à pasta e ao nome do arquivo
            if (aula.categoria !== categoria || aula.topico !== topico) {
                console.log("Cabeçalho diferente da pasta ou arquivo:", caminhoArquivo)
                return
            }

            cacheConteudos.push(aula)
        })
    })
}

// busca a aula no cache e devolve seu conteúdo junto dos comentários do banco
function buscarConteudo(req, res, next) {
    const { categoria, topico } = req.params

    if (!["html", "css", "javascript"].includes(categoria)) {
        return res.status(400).json({ erro: "Categoria inválida." })
    }

    if (typeof topico !== "string" || !/^[a-zA-Z0-9_-]+$/.test(topico)) {
        return res.status(400).json({ erro: "Tópico inválido." })
    }

    const aula = cacheConteudos.find((item) => {
        return item.categoria === categoria && item.topico === topico
    })

    if (!aula) {
        return res.status(404).json({ erro: "Aula não encontrada." })
    }

    comentarioModel.buscarPorTopico(categoria, topico, (erro, comentarios) => {
        if (erro) {
            return next(erro)
        }

        // informa quais comentários pertencem ao usuário conectado
        comentarios.forEach((comentario) => {
            comentario.podeExcluir = Boolean(
                req.session.usuario && Number(comentario.com_user_id) === Number(req.session.usuario.id)
            )
        })

        return res.json({
            conteudo: aula.conteudo,
            comentarios
        })
    })
}

// lista os tópicos da categoria em ordem alfabética usando o cache
function listarTopicos(req, res) {
    const categoria = req.params.categoria

    if (!["html", "css", "javascript"].includes(categoria)) {
        return res.status(400).json({ erro: "Categoria inválida." })
    }

    const topicos = cacheConteudos
        .filter((aula) => aula.categoria === categoria)
        .map((aula) => aula.topico)
        .sort()

    return res.json({ topicos })
}

// pesquisa no cache e devolve a categoria e o tópico de cada aula encontrada
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

    // procura o termo na categoria no tópico e no texto de cada aula
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
    })

    return res.json({ resultados })
}

module.exports = {
    buscarConteudo,
    listarTopicos,
    carregarCacheConteudos,
    pesquisarConteudos
}