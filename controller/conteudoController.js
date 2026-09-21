const fs = require("fs")
const path = require("path")

const comentarioModel = require('../model/comentarioModel')
const logModel = require("../model/logModel")

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
function buscarConteudo(req, res) {
    const categoria = req.params.categoria
    const topico = req.params.topico

    if (categoria !== "html" && categoria !== "css" && categoria !== "javascript") {
        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Categoria inválida" })
    }

    //regex que permite apenas letras, numeros, hifen e underline
    const nomeValido = /^[a-zA-Z0-9_-]+$/ 

    if (!topico || !nomeValido.test(topico)) {

        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Tópico inválido" })
    }

    const caminhoArquivo = path.join(__dirname, "../content", categoria, `${topico}.md`)

    fs.readFile(caminhoArquivo, "utf8", (erroArquivo, conteudo) => {
        if (erroArquivo) {

            // o erro ENOENT da biblioteca fs significa "No such file or directory" (arquivo ou pasta não encontrado)
            if (erroArquivo.code === "ENOENT") {

                // status 404 - recurso não encontrado
                return res.status(404).json({ erro: "Aula não encontrada" })
            }
            console.log("Erro ao ler a aula:", erroArquivo)

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível ler a aula" })
        }


        const aula = extrairMetadados(conteudo)

        if (aula === null) {

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "O cabeçalho da aula está incompleto ou incorreto" })
        }

        if (aula.categoria !== categoria || aula.topico !== topico) {

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "O cabeçalho não corresponde à pasta e ao nome da aula" })
        }


        comentarioModel.buscarPorTopico(categoria, topico, (erroComentario, comentarios) => {
            if (erroComentario) {
                console.log("Erro ao buscar comentários:", erroComentario)

                // status 500 - erro interno do servidor
                return res.status(500).json({ erro: "Não foi possível buscar os comentários" })
            }

            // informa ao navegador quais comentários pertencem ao usuário conectado
            comentarios.forEach((comentario) => {
                comentario.podeExcluir = false

                if (req.session.usuario) {
                    comentario.podeExcluir = Number(comentario.com_user_id) === Number(req.session.usuario.id)
                }
            })

            // status 200 - requisição bem-sucedida
            return res.status(200).json({
                conteudo: aula.conteudo,
                comentarios: comentarios
            })
        })
    })
}

// recebe a categoria pela rota e devolve em json os nomes dos arquivos markdown em ordem alfabética
function listarTopicos(req, res) {
    const categoria = req.params.categoria

    if (categoria !== "html" && categoria !== "css" && categoria !== "javascript") {
        
        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Categoria inválida" })
    }

    const pasta = path.join(__dirname, "../content", categoria)

    // le o diretório inserido
    fs.readdir(pasta, { withFileTypes: true }, (erro, arquivos) => {
        if (erro) {

            // o erro ENOENT da biblioteca fs significa "No such file or directory" (arquivo ou pasta não encontrado)
            if (erro.code === "ENOENT") {
                return res.json({ topicos: [] })
            }

            console.log("Erro ao listar tópicos:", erro)

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível listar os tópicos" })
        }

        const topicos = []

        arquivos.forEach((arquivo) => {
            if (arquivo.isFile() && arquivo.name.endsWith(".md")) {

                // encontra o arquivo em "arquivo.name" e retorna o nome do arquivo, sem o sufixo ".md"
                const topico = path.basename(arquivo.name, ".md")

                topicos.push(topico)
            }
        })

        topicos.sort() // organiza o array de topicos

        return res.json({ topicos: topicos })
    })
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
    });

    // permite registrar pesquisas feitas por usuarios sem login
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