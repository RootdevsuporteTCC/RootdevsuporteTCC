const fs = require("fs")
const path = require("path")

const comentarioModel = require('../model/comentarioModel')

// mantém as aulas na memória para atender as pesquisas
const cacheConteudos = []

// recebe o markdown e retorna categoria, tópico e conteúdo ou null se o cabeçalho for inválido
function extrairMetadados(texto) {
    const linhas = texto.split("\n") //separa o texto em linhas

    // verifica se o arquivo tem cabeçalho
    if (linhas[0].trim() !== "---") {
        return null
    }

    let categoria = ""
    let topico = ""
    let fimCabecalho = -1

    // loop que começa depois da primeira linha do cabeçalho
    for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        
        // se chegar no fim do cabeçalho termina o loop
        if (linha === "---") {
            fimCabecalho = i
            break
        }

        // se a linha começa com "categoria:", captura os dados como a categoria da aula
        if (linha.startsWith("categoria:")) {
            categoria = linha.replace("categoria:", "").trim()
        }

        // se a linha começa com "topico:", captura os dados como o tópico da aula
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

// le as pastas das categorias e preenche o cache com as aulas validas
function carregarCacheConteudos() {
    cacheConteudos.length = 0

    const categorias = ["html", "css", "javascript"]

    categorias.forEach((categoria) => {
        const pasta = path.join(__dirname, "../content", categoria)

        // le o conteudo de um diretório de forma sincrona (espera terminar antes de continuar o codigo)
        const arquivos = fs.readdirSync(pasta, { withFileTypes: true })

        arquivos.forEach((arquivo) => {
            if (!arquivo.isFile() || !arquivo.name.endsWith(".md")) {
                return
            }

            const topico = path.basename(arquivo.name, ".md")

            //regex que permite apenas letras, numeros, hifen e underline
            if (!/^[a-zA-Z0-9_-]+$/.test(topico)) {
                console.log("Nome de tópico inválido:", arquivo.name)
                return
            }

            const caminhoArquivo = path.join(pasta, arquivo.name)
            const texto = fs.readFileSync(caminhoArquivo, "utf8") // le o conteúdo de um arquivo no padrão utf8

            const aula = extrairMetadados(texto)

            if (aula === null) {
                console.log("Cabeçalho inválido:", caminhoArquivo)
                return
            }

            // se os atributos do cabeçalho forem diferentes da pasta ou arquivo, o arquivo é rejeitado
            if (aula.categoria !== categoria || aula.topico !== topico) {
                console.log("Cabeçalho diferente da pasta ou arquivo:", caminhoArquivo)
                return
            }

            cacheConteudos.push(aula)
        })
    })
}

// recebe categoria e tópico pela rota, le a aula e devolve o markdown e os comentários em json
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

// recebe a categoria pela rota e devolve em json os nomes dos arquivos markdown em ordem alfabética
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

// recebe a pesquisa pela url, consulta o cache e devolve as categorias e os tópicos encontrados em json
function pesquisarConteudos(req, res) {
    const pesquisa = req.query.pesquisa || ""

    if (typeof pesquisa !== "string") {

        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Pesquisa inválida" })
    }

    const termo = pesquisa.trim().toLowerCase()

    if (termo.length > 100) {

        // status 400 - requisição inválida
        return res.status(400).json({ erro: "A pesquisa deve ter até 100 caracteres" })
    }

    if (termo === "") {
        return res.json({ resultados: [] })
    }

    const resultados = []

    // procura o termo na categoria, no tópico e no texto de cada aula
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