const form = {
    tabelaConsulta: document.getElementById("tabela-consulta"),
    admInicio: document.getElementById("adm-inicio"),
    botaoVoltar: document.getElementById("botao-voltar"),
    formEdicao: document.getElementById("form-edicao")
}

let paginaUsuariosAtual = 1
let pesquisaUsuariosAtual = ""

let paginaComentariosAtual = 1
let pesquisaComentariosAtual = ""

let paginaLogsAtual = 1
let pesquisaLogsAtual = ""


//funções gerais
function abrirConsulta() {
    form.botaoVoltar.classList.remove("remove")
    form.admInicio.classList.add("remove")

    form.tabelaConsulta.innerHTML = ""
    form.formEdicao.innerHTML = ""
}

function abrirEdicao() {
    form.tabelaConsulta.innerHTML = ""
    form.formEdicao.innerHTML = ""
}

function voltarInicio() {
    form.botaoVoltar.classList.add("remove")
    form.admInicio.classList.remove("remove")

    form.tabelaConsulta.innerHTML = ""
    form.formEdicao.innerHTML = ""
}

//funções usuario
function atualizarPreviewAvatarAdm() {
    const campoAvatar = document.getElementById("edit-avatar")
    const previaAvatar = document.getElementById("avatar-previa")

    previaAvatar.innerText = campoAvatar.value || ":D"
}

function mudarPaginaUsuarios(direcao) {
    const novaPagina = paginaUsuariosAtual + direcao

    if (novaPagina < 1) {
        return
    }

    mostrarUsuarios(pesquisaUsuariosAtual, novaPagina)
}

async function mostrarUsuarios(pesquisa = "", pagina = 1) {
    abrirConsulta()

    form.tabelaConsulta.innerHTML = "<p>Carregando...</p>"
    
    try {
        const endereco = `/adm/usuarios?pesquisa=${encodeURIComponent(pesquisa)}&pagina=${pagina}`

        const resposta = await fetch(endereco)

        if (!resposta.ok) {
            throw new Error("Erro ao consultar usuários.");
        }

        const dados = await resposta.json()
        const usuarios = dados.usuarios

        paginaUsuariosAtual = dados.pagina
        pesquisaUsuariosAtual = pesquisa

        form.tabelaConsulta.innerHTML = `
            <h1 class="disket-font">Consulta de usuários</h1>

            <div class="form-pesquisa">
                <form onsubmit="pesquisarUsuarios(event)">
                    <input type="text" id="campo-pesquisa" placeholder="Pesquisar por nome, email ou tipo... ">

                    <button type="submit"><i class="fa-solid fa-magnifying-glass"></i> Pesquisar</button>
                    <button type="button" onclick="limparPesquisa()">Limpar</button>
                </form>
            </div>
            <div class="tabela-rolagem">
                <table class="tabela-admin">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Tipo</th>
                            <th>Avatar</th>
                            <th>Ações</th> 
                        </tr>
                    </thead>

                    <tbody id="usuarios-encontrados"></tbody>
                </table>
            </div>

            <div class="paginacao">
                <button type="button", id="pagina-anterior" onclick="mudarPaginaUsuarios(-1)">Anterior</button>
                <p id="pagina-atual"></p>
                <button type="button" id="proxima-pagina" onclick="mudarPaginaUsuarios(1)">Próxima</button>
            </div>
        `

        document.getElementById("campo-pesquisa").value = pesquisa

        const corpoTabela = document.getElementById("usuarios-encontrados")

        if (usuarios.length === 0) {
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="6">Nenhum usuário encontrado nessa página.</td>
                </tr>
            `
        }

        usuarios.forEach((usuario) => {
            corpoTabela.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <button type="button" class="editar-usuario"><i class="fa-solid fa-pen"></i> Editar</button>
                            <button type="button" class="excluir-usuario"><i class="fa-solid fa-trash-can"></i> Excluir</button>
                        </td>
                    </tr>
                `)

            const linha = corpoTabela.lastElementChild
            const colunas = linha.querySelectorAll("td")

            colunas[0].innerText = usuario.user_id
            colunas[1].innerText = usuario.user_name
            colunas[2].innerText = usuario.user_email
            colunas[3].innerText = usuario.user_tipo
            colunas[4].innerText = usuario.user_avatar

            linha.querySelector(".editar-usuario").addEventListener("click", () => {
                editarUsuario(usuario.user_id)
            })

            linha.querySelector(".excluir-usuario").addEventListener("click", () => {
                excluirUsuario(usuario.user_id)
            })
        });

        document.getElementById("pagina-atual").innerText = `Página ${paginaUsuariosAtual}`

        document.getElementById("pagina-anterior").disabled = paginaUsuariosAtual === 1

        document.getElementById("proxima-pagina").disabled = !dados.temProxima
        
    } catch (erro) {
        console.log("Erro ao carregar usuários:", erro)

        form.tabelaConsulta.innerHTML = `
            <p>Não foi possível carregar os usuários. Confira se você está logado como admin.</p>
        `
    }
}

async function excluirUsuario(id) {
    const confirmar = confirm("Deletar Usuário?")

    if (!confirmar) {
        return
    }

    try {
        const resposta = await fetch(`/adm/usuarios/${id}`, { method: "DELETE" })
        const dados = await resposta.json()
        
        if (!resposta.ok) {
            alert(dados.erro)
            return
        }
        alert(dados.mensagem)

        mostrarUsuarios(pesquisaUsuariosAtual, paginaUsuariosAtual)
    } catch (erro) {
        console.error(erro)
        alert("Erro ao excluir usuário", erro)
    }
}

async function editarUsuario(id) {

    try {
        const resposta = await fetch(`/adm/usuarios/${id}`)
        const usuario = await resposta.json()

        if (!resposta.ok) {
            form.formEdicao.innerHTML = `
                <h1 class="disket-font">EDITAR USUÁRIO</h1>
                <p>${usuario.erro}</p>
            `
            return
        }

        abrirEdicao()

        form.formEdicao.innerHTML = `

            <div id="form-box">
                <form onsubmit="salvarEdicao(event, ${usuario.user_id})" class="white-text" id="formCadastro">

                    <h1 class="disket-font">EDITAR USUÁRIO</h1>
                    <div class="campo">
                        <label for="edit-nome">Nome de Usuário:</label>
                        <div>
                            <input id="edit-nome" name="nome" type="text" value="${usuario.user_name}" required placeholder="JoaozinhoLegau123"> <span class="required">*</span>
                        </div>
                    </div>

                    <div class="campo">
                        <label for="edit-email">E-Mail:</label>
                        <div>
                            <input id="edit-email" name="email" type="email" value="${usuario.user_email}" required placeholder="joaozinho@email.com"> <span class="required">*</span>
                        </div>
                    </div> 

                    <div class="campo">
                        <label for="edit-tipo">Tipo de usuário:</label> 
                        <div>
                            <select id="edit-tipo">
                                <option value="usuario" ${usuario.user_tipo === "usuario" ? "selected" : ""}>Usuário</option>
                                <option value="admin" ${usuario.user_tipo === "admin" ? "selected" : ""}>Admin</option>
                            </select> <span class="hidden">*</span>
                        </div>
                    </div> 

                    <div class="campo">
                        <label for="edit-avatar">Digite um Avatar:</label> 
                        <div class="avatar-edicao">
                            <input id="edit-avatar" name="avatar" type="text" placeholder=":D" maxlength="10">
                            <p class="avatar" id="avatar-previa">:D</p>
                        </div>
                    </div>

                    <div id="form-confirm">
                        <button type="submit" class="main-button disket-font">SALVAR</button>
                    </div>
                </form>
            </div>
        `

        const campoAvatar = document.getElementById("edit-avatar")

        campoAvatar.value = usuario.user_avatar || ""

        campoAvatar.addEventListener("input", atualizarPreviewAvatarAdm)

        atualizarPreviewAvatarAdm()

    } catch (erro) {
        console.log(erro)

        form.formEdicao.innerHTML = `
            <p>Erro ao carregar usuário.</p>
        `
    }
}

async function salvarEdicao(event, id) {
    event.preventDefault()

    const nome = document.getElementById("edit-nome").value
    const email = document.getElementById("edit-email").value
    const tipo = document.getElementById("edit-tipo").value
    const avatar = document.getElementById("edit-avatar").value

    const usuarioAtualizado = {
        nome: nome,
        email: email,
        tipo: tipo,
        avatar: (avatar || ":D")
    }

    try {
        const resposta = await fetch(`/adm/usuarios/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuarioAtualizado)
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            alert(dados.erro)
            return
        }

        await verificarLogin()

        alert(dados.mensagem)

        mostrarUsuarios(pesquisaUsuariosAtual, paginaUsuariosAtual)
    } catch (erro) {
        console.log(erro)
        alert("Erro ao atualizar usuário.")
    }
}

function pesquisarUsuarios(event) {
    event.preventDefault()

    const pesquisa = document.getElementById("campo-pesquisa").value

    mostrarUsuarios(pesquisa, 1)
}

function limparPesquisa() {
    mostrarUsuarios("", 1)
}

//funções comentario
function mudarPaginaComentarios(direcao) {
    const novaPagina = paginaComentariosAtual + direcao

    if (novaPagina < 1) {
        return
    }

    mostrarComentarios(pesquisaComentariosAtual, novaPagina)
}

function pesquisarComentarios(event) {
    event.preventDefault()

    const pesquisa = document.getElementById("campo-pesquisa").value

    mostrarComentarios(pesquisa, 1)
}

function limparPesquisaComentarios() {
    mostrarComentarios("", 1)
}

async function mostrarComentarios(pesquisa = "", pagina = 1) {
    abrirConsulta()

    form.tabelaConsulta.innerHTML = "<p>Carregando...</p>"

    try {
        const endereco = `/adm/comentarios?pesquisa=${encodeURIComponent(pesquisa)}&pagina=${pagina}`
        const resposta = await fetch(endereco)

        if (!resposta.ok) {
            throw new Error("Erro ao consultar comentários");
        }

        const dados = await resposta.json()
        const comentarios = dados.comentarios

        paginaComentariosAtual = dados.pagina
        pesquisaComentariosAtual = pesquisa

        form.tabelaConsulta.innerHTML = `
            <h1 class="disket-font">Consulta de comentários</h1>

            <div class="form-pesquisa">
                <form onsubmit="pesquisarComentarios(event)">
                    <input type="text" id="campo-pesquisa" placeholder="Pesquisar texto, autor, categoria, tópico ou ID...">

                    <button type="submit"><i class="fa-solid fa-magnifying-glass"></i> Pesquisar</button>
                    <button type="button" onclick="limparPesquisaComentarios()">Limpar</button>
                </form>
            </div>

            <div class="tabela-rolagem">
                <table class="tabela-admin">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Autor</th>
                            <th>Categoria</th>
                            <th>Tópico</th>
                            <th>Comentário</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody id="comentarios-encontrados"></tbody>
                </table>
            </div>

            <div class="paginacao">
                <button type="button" id="pagina-anterior" onclick="mudarPaginaComentarios(-1)">Anterior</button>

                <p id="pagina-atual"></p>

                <button type="button" id="proxima-pagina" onclick="mudarPaginaComentarios(1)">Próxima</button>
            </div>
        `

        document.getElementById("campo-pesquisa").value = pesquisa

        const corpoTabela = document.getElementById("comentarios-encontrados")

        if (comentarios.length === 0) {
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="7">Nenhum comentário encontrado nesta página.</td>
                </tr>
            `
        }

        comentarios.forEach((comentario) => {
            corpoTabela.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="texto-tabela"></td>
                        <td></td>
                        <td>
                            <button type="button" class="excluir-comentario-admin"><i class="fa-solid fa-trash-can"></i> Excluir</button>
                        </td>
                    </tr>
                `)

                const linha = corpoTabela.lastElementChild
                const colunas = linha.querySelectorAll("td")

                colunas[0].innerText = comentario.com_id
                colunas[1].innerText = comentario.user_name
                colunas[2].innerText = comentario.com_categoria
                colunas[3].innerText = comentario.com_topico
                colunas[4].innerText = comentario.com_texto
                colunas[5].innerText = new Date(comentario.com_data).toLocaleString("pt-BR")

                linha.querySelector(".excluir-comentario-admin").addEventListener("click", () => {
                    excluirComentarioAdmin(comentario.com_id)
                })
        })

        document.getElementById("pagina-atual").innerText = `Página ${paginaComentariosAtual}`

        document.getElementById("pagina-anterior").disabled = paginaComentariosAtual === 1

        document.getElementById("proxima-pagina").disabled = !dados.temProxima
    } catch (erro) {
        console.log("Erro ao carregar comentários:", erro)

        form.tabelaConsulta.innerHTML = `
            <p>Não foi possível carregar os comentários. Confira se você está conectado como admin.</p>
        `
    }
}

async function excluirComentarioAdmin(id) {
    const confirmou = confirm("Deseja excluir esse comentário?")

    if (!confirmou) {
        return
    }

    try {
        const resposta = await fetch(`/adm/comentarios/${id}`, {
            method: "DELETE"
        })

        if (resposta.status === 401 || resposta.status === 403) {
            alert("É necessário estar conectado como admin.")
            return
        }

        const dados = await resposta.json()

        if (!resposta.ok) {
            alert(dados.erro)
            return
        }

        alert(dados.mensagem)

        await mostrarComentarios(pesquisaComentariosAtual, paginaComentariosAtual)
    } catch (erro) {
        console.log("Erro ao excluir comentário:", erro)

        alert("Não foi possível confirmar a exclusão. Atualize a consulta para conferir.")
    }
}

//funções log
function mudarPaginaLogs(direcao) {
    const novaPagina = paginaLogsAtual + direcao

    if (novaPagina < 1) {
        return
    }

    mostrarLogs(pesquisaLogsAtual, novaPagina)
}

function pesquisarLogs(event) {
    event.preventDefault()

    const pesquisa = document.getElementById("campo-pesquisa").value

    mostrarLogs(pesquisa, 1)
}

function limparPesquisaLogs() {
    mostrarLogs("", 1)
}

async function mostrarLogs(pesquisa = "", pagina = 1) {
    abrirConsulta()

    form.tabelaConsulta.innerHTML = "<p>Carregando..</p>"

    try {
        const endereco = `/adm/logs?pesquisa=${encodeURIComponent(pesquisa)}&pagina=${pagina}`
        const resposta = await fetch(endereco)

        if (!resposta.ok) {
            const mensagem = await resposta.text()

            throw new Error(`HTTP ${resposta.status}: ${mensagem}`);
        }

        const dados = await resposta.json()
        const logs = dados.logs

        paginaLogsAtual = dados.pagina
        pesquisaLogsAtual = pesquisa

        form.tabelaConsulta.innerHTML = `
            <h1 class="disket-font">Consulta de Relatórios</h1>

            <div class="form-pesquisa">
                <form onsubmit="pesquisarLogs(event)">
                    <input type="text" id="campo-pesquisa" placeholder="Pesquisar ação, usuário ou ID...">

                    <button type="submit"><i class="fa-solid fa-magnifying-glass"></i>Pesquisar</button>

                    <button type="button" onclick="limparPesquisaLogs()">Limpar</button>
                </form>
            </div>

            <div class="tabela-rolagem">
                <table class="tabela-admin">
                    <thead>
                        <tr>
                            <th>ID do log</th>
                            <th>ID do usuário</th>
                            <th>Usuário</th>
                            <th>Ação</th>
                            <th>Data</th>
                        </tr>
                    </thead>

                    <tbody id="logs-encontrados"></tbody>
                </table>
            </div>

            <div class="paginacao">
                <button type="button" id="pagina-anterior" onclick="mudarPaginaLogs(-1)">Anterior</button>

                <p id="pagina-atual"></p>

                <button type="button" id="proxima-pagina" onclick="mudarPaginaLogs(1)">Próxima</button>
            </div>
        `

        document.getElementById("campo-pesquisa").value = pesquisa

        const corpoTabela = document.getElementById("logs-encontrados")

        if (logs.length === 0) [
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="5">Nenhum registro encontrado</td>
                </tr>
            `
        ]

        logs.forEach((log) => {
            corpoTabela.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="texto-tabela"></td>
                        <td></td>
                    </tr>
                `)

                const linha = corpoTabela.lastElementChild
                const colunas = linha.querySelectorAll("td")

                colunas[0].innerText = log.log_id
                colunas[1].innerText = log.tb_usuarios_user_id || "-"
                colunas[2].innerText = log.user_name || "Sem usuário vinculado"
                colunas[3].innerText = log.log_acao
                colunas[4].innerText = new Date(log.log_data).toLocaleString("pt-BR")
        })

        document.getElementById("pagina-atual").innerText = `Pagina ${paginaLogsAtual}`

        document.getElementById("pagina-anterior").disabled = paginaLogsAtual === 1

        document.getElementById("proxima-pagina").disabled = !dados.temProxima
    } catch (erro) {
        console.log("Erro ao carregar logs:", erro)

        form.tabelaConsulta.innerText = erro.message
    }
}