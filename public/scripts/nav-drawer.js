const menu = document.getElementById("nav-drawer-menu")
const menuIcon = document.getElementById("menu-icon")

// alterna a abertura do menu e o ícone mostrado no botão
function toggleMenu() {
    menu.classList.toggle("menu-aberto")
    menu.classList.toggle("menu-fechado")

    menuIcon.classList.toggle("fa-bars")
    menuIcon.classList.toggle("fa-xmark")
}

// fecha o menu hamburguer quando a janela fica numa largura maior
window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
        menu.classList.remove("menu-aberto")
        menu.classList.add("menu-fechado")

        menuIcon.classList.remove("fa-xmark")
        menuIcon.classList.add("fa-bars")
    }
})