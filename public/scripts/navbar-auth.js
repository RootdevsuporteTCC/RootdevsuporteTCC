// consulta o estado do login pelo fetch e monta a navegação do usuário conectado
async function verificarLogin() {
    try {
        const resposta = await fetch('/usuarios/sessao')

        if (!resposta.ok) {
            throw new Error("Não foi possível verificar a sessão");  
        }

        const dados = await resposta.json()

        // mantem os controles de visitante quando não existe login ativo
        if (!dados.logado) {
            return
        }

        const authButtons = document.getElementById("auth-buttons")
        const navDrawerMenu = document.getElementById("nav-drawer-menu")

        authButtons.innerHTML = `
            <div id="user-painel">
                <div>
                    <a href="/perfil.html" id="avatar-usuario"><button>Meu Perfil</button></a> 
                    <form action="/usuarios/logout" method="POST">
                        <button type="submit" id="sair">Sair</button>
                    </form>
                </div>
                <p class="avatar"></p>
            </div>
        `

        navDrawerMenu.innerHTML = `
            <div id="menu-avatar-usuario">
                <a href="/perfil.html" id="avatar-usuario"><button>Meu Perfil</button></a> 
                <p class="avatar"></p>
                <form action="/usuarios/logout" method="POST">
                    <button type="submit" id="sair">Sair</button>
                </form>
            </div>
        `

        // insere o avatar recebido como texto nos dois menus
        authButtons.querySelector(".avatar").innerText = dados.usuario.avatar || ":D"
        navDrawerMenu.querySelector(".avatar").innerText = dados.usuario.avatar || ":D"

    } catch (erro) {
        console.log("Erro ao verificar sessão:", erro)
    }
}

// consulta a sessão quando o script é carregado
verificarLogin()