const tituloCategoria = document.getElementById("matter-title")
const botaoMenu = document.getElementById("toggle-menu")
const menuLateral = document.querySelector("aside")
const setaMenu = document.getElementById("arrow")

const parametros = new URLSearchParams(window.location.search)

let categoria = parametros.get("categoria")

if (
    categoria !== "html" &&
    categoria !== "css" &&
    categoria !== "javascript"
) {
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

if (window.innerWidth <= 768) {
    menuLateral.classList.add("fechado")
}

atualizarTitulo()
atualizarSeta()
aplicarTema()