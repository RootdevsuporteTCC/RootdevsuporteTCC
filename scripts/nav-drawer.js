function toggleMenu() {
    const menu = document.getElementById("nav-drawer-menu")
    const menuIcon = document.getElementById("menu-icon")
    
    menu.classList.toggle("menu-aberto")
    menu.classList.toggle("menu-fechado")

    menuIcon.classList.toggle("fa-bars")
    menuIcon.classList.toggle("fa-xmark")
}