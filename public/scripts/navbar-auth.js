async function verificarLogin() {
    try {
        const resposta = await fetch('/usuarios/sessao')
        const dados = await resposta.json()

        if (!dados.logado) {
            return
        }

        const authButtons = document.getElementById("auth-buttons")
        const navDrawerMenu = document.getElementById("nav-drawer-menu")

        authButtons.innerHTML = `
            <div id="user-painel">
                <div>
                    <a href"/perfil.html" id="avatar-usuario"><button>Meu Perfil</button></a> 
                    <form action="/usuarios/logout" method="POST">
                        <button type="submit" id="sair">Sair</button>
                    </form>
                </div>
                <p class="avatar">${dados.usuario.avatar || ":D"}</p>
            </div>
        `

        navDrawerMenu.innerHTML = `
            <div id="menu-avatar-usuario">
                <a href"/perfil.html" id="avatar-usuario"><button>Meu Perfil</button></a> 
                <p class="avatar">${dados.usuario.avatar || ":D"}</p>
                <form action="/usuarios/logout" method="POST">
                    <button type="submit" id="sair">Sair</button>
                </form>
            </div>
        `

    } catch (erro) {
        console.log("Erro ao verificar sessão:", erro)
    }
}

verificarLogin()