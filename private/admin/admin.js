const form = {
    tabelaConsulta: document.getElementById("tabela-consulta"),
    admInicio: document.getElementById("adm-inicio"),
    botaoVoltar: document.getElementById("botao-voltar")
}

function toggleInicio() {
    form.botaoVoltar.classList.toggle("remove")
    form.admInicio.classList.toggle("remove")
    form.tabelaConsulta.innerHTML = ""
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

async function mostrarComentarios() {
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

async function mostrarRelatorios() {
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
        console.log(resposta.json())
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