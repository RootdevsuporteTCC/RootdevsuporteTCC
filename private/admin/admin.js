const form = {
    tabelaConsulta: document.getElementById("tabela-consulta"),
    admInicio: document.getElementById("adm-inicio"),
    botaoVoltar: document.getElementById("botao-voltar"),
    formEdicao: document.getElementById("form-edicao")
}

// mantém a página e a pesquisa de cada consulta durante a navegação
let paginaUsuariosAtual = 1
let pesquisaUsuariosAtual = ""

let paginaComentariosAtual = 1
let pesquisaComentariosAtual = ""

let paginaLogsAtual = 1
let pesquisaLogsAtual = ""


//funções gerais

// prepara a area de consulta e esconde as opções iniciais do painel
function abrirConsulta() {
    form.botaoVoltar.classList.remove("remove")
    form.admInicio.classList.add("remove")

    form.tabelaConsulta.innerHTML = ""
    form.formEdicao.innerHTML = ""
}

// limpa as areas de consulta e edição antes de montar o formulário
function abrirEdicao() {
    form.tabelaConsulta.innerHTML = ""
    form.formEdicao.innerHTML = ""
}

// limpa as areas abertas e mostra as opções iniciais
function voltarInicio() {
    form.botaoVoltar.classList.add("remove")
    form.admInicio.classList.remove("remove")

    form.tabelaConsulta.innerHTML = ""
    form.formEdicao.innerHTML = ""
}

//funções de usuario

// le o avatar do formulário de edição e atualiza a prévia
function atualizarPreviewAvatarAdm() {
    const campoAvatar = document.getElementById("edit-avatar")
    const previaAvatar = document.getElementById("avatar-previa")

    previaAvatar.innerText = campoAvatar.value || ":D"
}

// recebe a direção da navegação e solicita outra página mantendo a pesquisa
function mudarPaginaUsuarios(direcao) {
    const novaPagina = paginaUsuariosAtual + direcao

    if (novaPagina < 1) {
        return
    }

    mostrarUsuarios(pesquisaUsuariosAtual, novaPagina)
}

// recebe pesquisa e página, consulta os usuários pelo fetch e monta a tabela
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

        // cria as linhas da página recebida e preenche as células com os dados
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

        // ajusta os botões conforme a página atual e a existência de mais resultados
        document.getElementById("pagina-anterior").disabled = paginaUsuariosAtual === 1
        document.getElementById("proxima-pagina").disabled = !dados.temProxima
        
    } catch (erro) {
        console.log("Erro ao carregar usuários:", erro)

        form.tabelaConsulta.innerHTML = `
            <p>Não foi possível carregar os usuários. Confira se você está logado como admin.</p>
        `
    }
}

// recebe o id, confirma a exclusão e atualiza a consulta depois da resposta do servidor
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

// recebe o id, consulta os dados pelo fetch e monta o formulário de edição
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

        // preenche o avatar depois de criar os campos do formulário
        campoAvatar.value = usuario.user_avatar || ""

        // conecta a prévia ao campo que acabou de ser inserido na página
        campoAvatar.addEventListener("input", atualizarPreviewAvatarAdm)

        atualizarPreviewAvatarAdm()

    } catch (erro) {
        console.log(erro)

        form.formEdicao.innerHTML = `
            <p>Erro ao carregar usuário.</p>
        `
    }
}

// recebe o evento e o id, envia os campos alterados e atualiza a consulta após salvar
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

        // atualiza a navegação caso os dados da conta conectada tenham sido alterados
        await verificarLogin()

        alert(dados.mensagem)

        mostrarUsuarios(pesquisaUsuariosAtual, paginaUsuariosAtual)
    } catch (erro) {
        console.log(erro)
        alert("Erro ao atualizar usuário.")
    }
}

// recebe o envio da pesquisa e consulta os usuários a partir da primeira página
function pesquisarUsuarios(event) {
    event.preventDefault()

    const pesquisa = document.getElementById("campo-pesquisa").value

    mostrarUsuarios(pesquisa, 1)
}

// consulta a primeira página de usuários sem usar um termo de pesquisa
function limparPesquisa() {
    mostrarUsuarios("", 1)
}

//funções de comentario

// recebe a direção e consulta outra página de comentários mantendo a pesquisa
function mudarPaginaComentarios(direcao) {
    const novaPagina = paginaComentariosAtual + direcao

    if (novaPagina < 1) {
        return
    }

    mostrarComentarios(pesquisaComentariosAtual, novaPagina)
}

// recebe o envio da pesquisa e consulta os comentários a partir da primeira página
function pesquisarComentarios(event) {
    event.preventDefault()

    const pesquisa = document.getElementById("campo-pesquisa").value

    mostrarComentarios(pesquisa, 1)
}

// consulta a primeira página de comentários sem aplicar um termo de pesquisa
function limparPesquisaComentarios() {
    mostrarComentarios("", 1)
}

// recebe pesquisa e página, consulta os comentários pelo fetch e monta a tabela
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

        // cria as linhas da página recebida e preenche as células com os dados
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

        // ajusta os botões conforme a página atual e a existência de mais resultados
        document.getElementById("pagina-anterior").disabled = paginaComentariosAtual === 1
        document.getElementById("proxima-pagina").disabled = !dados.temProxima
    } catch (erro) {
        console.log("Erro ao carregar comentários:", erro)

        form.tabelaConsulta.innerHTML = `
            <p>Não foi possível carregar os comentários. Confira se você está conectado como admin.</p>
        `
    }
}

// recebe o id, confirma a exclusão e atualiza a consulta após a resposta do servidor
async function excluirComentarioAdmin(id) {
    const confirmou = confirm("Deseja excluir esse comentário?")

    if (!confirmou) {
        return
    }

    try {
        const resposta = await fetch(`/adm/comentarios/${id}`, {
            method: "DELETE"
        })

        // status 401 - autenticação ausente ou inválida
        // status 403 - acesso negado
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

// recebe a direção e consulta outra página de logs mantendo a pesquisa
function mudarPaginaLogs(direcao) {
    const novaPagina = paginaLogsAtual + direcao

    if (novaPagina < 1) {
        return
    }

    mostrarLogs(pesquisaLogsAtual, novaPagina)
}

// recebe o envio da pesquisa e consulta os logs a partir da primeira página
function pesquisarLogs(event) {
    event.preventDefault()

    const pesquisa = document.getElementById("campo-pesquisa").value

    mostrarLogs(pesquisa, 1)
}

// consulta a primeira página de logs sem aplicar um termo de pesquisa
function limparPesquisaLogs() {
    mostrarLogs("", 1)
}

// recebe pesquisa e página, consulta os logs pelo fetch e monta a tabela
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

                    <button type="submit"><i class="fa-solid fa-magnifying-glass"></i> Pesquisar</button>

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

        // cria as linhas da página recebida e preenche as células com os dados
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
                colunas[1].innerText = log.tb_usuarios_user_id || "-" // mostra uma identificação diferente para logs sem conta vinculada
                colunas[2].innerText = log.user_name || "Sem usuário vinculado"
                colunas[3].innerText = log.log_acao
                colunas[4].innerText = new Date(log.log_data).toLocaleString("pt-BR")
        })

        document.getElementById("pagina-atual").innerText = `Pagina ${paginaLogsAtual}`

        // ajusta os botões conforme a página atual e a existência de mais resultados
        document.getElementById("pagina-anterior").disabled = paginaLogsAtual === 1
        document.getElementById("proxima-pagina").disabled = !dados.temProxima
    } catch (erro) {
        console.log("Erro ao carregar logs:", erro)

        form.tabelaConsulta.innerText = erro.message
    }
}