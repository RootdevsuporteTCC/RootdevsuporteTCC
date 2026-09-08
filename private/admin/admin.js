const form = {
    tabelaConsulta: document.getElementById("tabela-consulta"),
    admInicio: document.getElementById("adm-inicio"),
    botaoVoltar: document.getElementById("botao-voltar"),
    formEdicao: document.getElementById("form-edicao")
}

function toggleInicio() {
    form.botaoVoltar.classList.toggle("remove")
    form.admInicio.classList.toggle("remove")
    form.tabelaConsulta.innerHTML = ""
    form.formEdicao.innerHTML = ""
}

async function mostrarUsuarios() {
    toggleInicio();
    
    try {
        const resposta = await fetch("/adm/usuarios")
        const usuarios = await resposta.json()

        let tabela = `
            <h1 class="disket-font">Consulta de usuários</h1>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Tipo</th>
                        <th>Avatar</th>
                        <th>Ações</th> 
                    </tr>
                </thead>

                <tbody>
        `;

        usuarios.forEach((usuario) => {
            tabela += `
                <tr>
                    <td>${usuario.user_id}</td>
                    <td>${usuario.user_name}</td>
                    <td>${usuario.user_email}</td>
                    <td>${usuario.user_telefone || '-'}</td>
                    <td>${usuario.user_tipo}</td>
                    <td>${usuario.user_avatar || '-'}</td>
                    <td>
                        <button onclick="editarUsuario(${usuario.user_id})"><i class="fa-solid fa-pen"></i> Editar</button>
                        <button onclick="excluirUsuario(${usuario.user_id})"><i class="fa-solid fa-trash-can"></i> Excluir</button>
                    </td>
                </tr>
            `
        });

        tabela += `
                </tbody>
            </table>
        `

        form.tabelaConsulta.innerHTML = tabela
    } catch (erro) {
        console.log(erro)

        form.tabelaConsulta.innerHTML = `
            <p>Erro ao carregar usuários</p>
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

        toggleInicio()
        mostrarUsuarios()
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

        form.tabelaConsulta.innerHTML = ""
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
                        <label for="edit-telefone">Telefone (opcional):</label> 
                        <div>
                            <input id="edit-telefone" name="telefone" type="tel" value="${usuario.user_telefone}" placeholder="(99) 12345-6789"> <span class="hidden">*</span>
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
                        <div>
                            <input id="edit-avatar" name="avatar" type="text" value="${usuario.user_avatar}" placeholder=":D" maxlength="10"> <span class="hidden">*</span>
                        </div>
                    </div>

                    <div id="form-confirm">
                        <button type="submit" class="main-button disket-font">SALVAR</button>
                    </div>
                </form>
            </div>
        `
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
    const telefone = document.getElementById("edit-telefone").value
    const tipo = document.getElementById("edit-tipo").value
    const avatar = document.getElementById("edit-avatar").value

    const usuarioAtualizado = {
        nome: nome,
        email: email,
        telefone: telefone,
        tipo: tipo,
        avatar: avatar
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

        alert(dados.mensagem)

        toggleInicio()
        mostrarUsuarios()
    } catch (erro) {
        console.log(erro)
        alert("Erro ao atualizar usuário.")
    }
}