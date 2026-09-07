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