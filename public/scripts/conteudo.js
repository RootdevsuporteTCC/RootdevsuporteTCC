const tituloCategoria = document.getElementById("matter-title")
const botaoMenu = document.getElementById("toggle-menu")
const menuLateral = document.querySelector("aside")
const setaMenu = document.getElementById("arrow")
const areaConteudo = document.getElementById("lesson-content")
const areaComentarios = document.getElementById("comments-container")
const listaTopicos = document.getElementById("topics-list")
const formComentario = document.getElementById("form-comentario")
const avisoLoginComentario = document.getElementById("aviso-login-comentario")
const mensagemComentario = document.getElementById("mensagem-comentario")
const campoComentario = document.getElementById("texto-comentario")
const botaoComentario = document.getElementById("botao-comentario")

let topicoAtual = ""
let ocupado = false

const parametros = new URLSearchParams(window.location.search)

let categoria = parametros.get("categoria")

if (categoria !== "html" && categoria !== "css" && categoria !== "javascript") {
    categoria = "html"
}

function atualizarTitulo() {
    if (categoria === "html") {
        tituloCategoria.textContent = "HTML"
    } else if (categoria === "css") {
        tituloCategoria.textContent = "CSS"
    } else {
        tituloCategoria.textContent = "JavaScript"
    }

    document.title = tituloCategoria.textContent + " - ROOT DEV"
}

function alternarMenu() {
    menuLateral.classList.toggle("fechado")
    atualizarSeta()
}
botaoMenu.addEventListener("click", alternarMenu)

function atualizarSeta() {
    if (menuLateral.classList.contains("fechado")) {
        setaMenu.className = "fa-solid fa-chevron-right"
    } else {
        setaMenu.className = "fa-solid fa-chevron-left"
    }
}

function aplicarTema() {
    document.body.setAttribute("data-categoria", categoria)
}

function exibirComentarios(comentarios) {
    areaComentarios.textContent = ""

    if (comentarios.length === 0) {
        areaComentarios.textContent = "Esta aula ainda não possui comentários."
        return
    }

    comentarios.forEach((comentario) => {
        const bloco = document.createElement("div")
        bloco.className = "user-commentary"

        bloco.innerHTML = `
            <p class="avatar"></p>

            <div class="comment-text-wrapper">
                <h2 class="user-name disket-font"></h2>
                <p class="commentary"></p>
            </div>
        `

        bloco.querySelector(".avatar").innerText = comentario.user_avatar
        bloco.querySelector(".user-name").innerText = comentario.user_name
        bloco.querySelector(".commentary").innerText = comentario.com_texto

        areaComentarios.appendChild(bloco)
    });
}

function exibirConteudo(markdown) {
    const html = marked.parse(markdown)
    const htmlSeguro = DOMPurify.sanitize(html)

    areaConteudo.innerHTML = htmlSeguro

    const titulo = areaConteudo.querySelector("h1")

    if (titulo) {
        titulo.classList.add("title-center", "disket-font")
    }
}

async function carregarConteudo(topico) {
    if (ocupado) {
        return
    }

    ocupado = true
    topicoAtual = ""

    botaoComentario.disabled = true
    campoComentario.disabled = true

    areaConteudo.innerText = "Carregando..."
    areaComentarios.innerText = ""
    mensagemComentario.innerText = ""

    try {
        const endereco =  `/conteudo/${encodeURIComponent(categoria)}/${encodeURIComponent(topico)}`

        const resposta = await fetch(endereco)
        const dados = await resposta.json()

        if (!resposta.ok) {
            areaConteudo.innerText = dados.erro
            return
        }

        exibirConteudo(dados.conteudo)
        exibirComentarios(dados.comentarios)

        topicoAtual = topico
        campoComentario.value = ""

    } catch (erro) {
        console.log("Erro ao carregar a aula:", erro)

        areaConteudo.textContent = "Não foi possível carregar a aula."
    } finally {
        ocupado = false
        campoComentario.disabled = false
        botaoComentario.disabled = topicoAtual === ""
    }
}

async function carregarTopicos() {
    listaTopicos.innerHTML = "<li>Carregando...</li>"

    try {
        const resposta = await fetch(`/conteudo/${categoria}`)
        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados.erro);
        }

        listaTopicos.innerHTML = ""

        if (dados.topicos.length === 0) {
            listaTopicos.innerHTML = "<li>Nenhum tópico disponível</li>"
            return
        }

        dados.topicos.forEach((topico) => {
            listaTopicos.insertAdjacentHTML("beforeend", `
                    <li>
                        <p class="texto-topico"></p>
                    </li>
                `)

                const item = listaTopicos.lastElementChild
                const texto = item.querySelector(".texto-topico")

                texto.innerText = topico.replaceAll("-", " ").replaceAll("_", " ")

                item.addEventListener("click", () => {
                    carregarConteudo(topico)
                })
        })
    } catch (erro) {
        console.log("Erro ao carregar tópicos:", erro)

        listaTopicos.innerHTML = "<li>Não foi possível carregar os tópicos</li>"
    }
}

async function verificarLoginComentario() {
    try {
        const resposta = await fetch("/usuarios/sessao")

        if (!resposta.ok) {
            throw new Error("Erro ao verificar a sessão");
        }

        const dados = await resposta.json()

        mensagemComentario.innerText = ""

        if (dados.logado) {
            formComentario.hidden = false
            avisoLoginComentario.hidden = true
        } else {
            formComentario.hidden = true
            avisoLoginComentario.hidden = false
        }
    } catch (erro) {
        console.log("Erro ao verificar login:", erro)

        formComentario.hidden = true
        avisoLoginComentario.hidden = true

        mensagemComentario.innerText = "Não foi possível verificar seu login. Atualize a página."
    }
}

async function enviarComentario(event) {
    event.preventDefault()

    if (ocupado) {
        return
    }

    if (topicoAtual === "") {
        mensagemComentario.innerText = "Selecione uma aula para comentar."
        return
    }

    const texto = campoComentario.value.trim()

    if (texto.length === 0 || texto.length > 1000) {
        mensagemComentario.innerText = "Escreva um comentario entre 1 e 1000 caracteres."
        return
    }

    const topicoEnviado = topicoAtual

    ocupado = true
    botaoComentario.disabled = true
    campoComentario.disabled = true

    mensagemComentario.innerText = "Enviando..."

    try {
        const resposta = await fetch("/comentarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                texto: texto,
                categoria: categoria,
                topico: topicoEnviado
            })
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagemComentario.innerText = dados.erro

            if (resposta.status === 401) {
                formComentario.hidden = true
                avisoLoginComentario.hidden = false
            }

            return
        }

        campoComentario.value = ""

        ocupado = false
        await carregarConteudo(topicoEnviado)

        mensagemComentario.innerText = dados.mensagem
    } catch (erro) {
        console.log("Erro ao enviar comentário:", erro)

        mensagemComentario.innerText = "Não foi possível confirmar o envio. Confira os comentários antes de tentar novamente."
    } finally {
        ocupado = false
        campoComentario.disabled = false
        botaoComentario.disabled = topicoAtual === ""
    }
}
formComentario.addEventListener("submit", enviarComentario)

if (window.innerWidth <= 768) {
    menuLateral.classList.add("fechado")
}

atualizarTitulo()
atualizarSeta()
aplicarTema()
carregarTopicos()
verificarLoginComentario()

const topicoInicial = parametros.get("topico")

if (topicoInicial) {
    carregarConteudo(topicoInicial)
} else {
    areaConteudo.textContent = "Nenhuma aula selecionada."
}