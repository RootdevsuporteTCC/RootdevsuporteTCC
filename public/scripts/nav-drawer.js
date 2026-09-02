const menu = document.getElementById("nav-drawer-menu")
const menuIcon = document.getElementById("menu-icon")

function toggleMenu() {
    menu.classList.toggle("menu-aberto")
    menu.classList.toggle("menu-fechado")

    menuIcon.classList.toggle("fa-bars")
    menuIcon.classList.toggle("fa-xmark")
}

window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
        menu.classList.remove("menu-aberto")
        menu.classList.add("menu-fechado")

        menuIcon.classList.remove("fa-xmark")
        menuIcon.classList.add("fa-bars")
    }
})