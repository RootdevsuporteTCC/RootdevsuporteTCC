// mantém a função de navegação no escopo deste arquivo
(()=> {
    // usa a consulta compartilhada da sessão para montar os controles da conta conectada
    async function verificarLogin(atualizar = false) {
        try {
            const { consultarSessao } = await import("/scripts/sessao-cliente.js")
            const dados = await consultarSessao(atualizar)

            // mantém os controles iniciais de visitante quando a página abre sem login
            if (!dados.logado) {
                return
            }

            const authButtons = document.getElementById("auth-buttons")
            const navDrawerMenu = document.getElementById("nav-drawer-menu")

            authButtons.innerHTML = `
                <div id="user-painel">
                    <div>
                        <a href="/perfil.html" class="avatar-usuario"><button>Meu Perfil</button></a> 
                        <form action="/usuarios/logout" method="POST">
                            <button type="submit" class="sair">Sair</button>
                        </form>
                    </div>
                    <p class="avatar"></p>
                </div>
            `

            navDrawerMenu.innerHTML = `
                <div id="menu-avatar-usuario">
                    <a href="/perfil.html" class="avatar-usuario"><button>Meu Perfil</button></a> 
                    <p class="avatar"></p>
                    <form action="/usuarios/logout" method="POST">
                        <button type="submit" class="sair">Sair</button>
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

    // busca os dados novos da sessão quando uma edição avisa que o perfil mudou
    document.addEventListener("perfil-atualizado", () => {
        verificarLogin(true)
    })

    // consulta a sessão quando o script é carregado
    verificarLogin()
})()