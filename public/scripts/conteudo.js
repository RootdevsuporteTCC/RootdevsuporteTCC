const tituloCategoria = document.getElementById("matter-title")
const botaoMenu = document.getElementById("toggle-menu")
const menuLateral = document.querySelector("aside")
const setaMenu = document.getElementById("arrow")
const areaConteudo = document.getElementById("lesson-content")
const areaComentarios = document.getElementById("comments-container")

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
    areaConteudo.textContent = "Carregando..."
    areaComentarios.textContent = ""

    try {
        const endereco =  `/conteudo/${encodeURIComponent(categoria)}/${encodeURIComponent(topico)}`

        const resposta = await fetch(endereco)
        const dados = await resposta.json()

        if (!resposta.ok) {
            areaConteudo.textContent = dados.erro
            return
        }

        exibirConteudo(dados.conteudo)
        exibirComentarios(dados.comentarios)

    } catch (erro) {
        console.log("Erro ao carregar a aula:", erro)

        areaConteudo.textContent = "Não foi possível carregar a aula."
    }
}

if (window.innerWidth <= 768) {
    menuLateral.classList.add("fechado")
}

atualizarTitulo()
atualizarSeta()
aplicarTema()

const topicoInicial = parametros.get("topico")

if (topicoInicial) {
    carregarConteudo(topicoInicial)
} else {
    areaConteudo.textContent = "Nenhuma aula selecionada."
}