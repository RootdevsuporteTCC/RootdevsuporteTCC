const formPerfil            =    document.getElementById("form-perfil")
const campoNomePerfil       =    document.getElementById("nome")
const campoEmailPerfil      =    document.getElementById("email")
const campoAvatarPerfil     =    document.getElementById("avatar")
const previaAvatarPerfil    =    document.getElementById("avatar-previa")
const campoSenhaAtual       =    document.getElementById("senha-atual")
const botaoSalvarPerfil     =    document.getElementById("botao-salvar-perfil")
const botaoExcluirPerfil    =    document.getElementById("botao-excluir-perfil")

// atualiza a prévia do avatar e usa o padrão quando o campo está vazio
function atualizarPreviaPerfil() {
    previaAvatarPerfil.innerText = campoAvatarPerfil.value || ":D"
}

// carrega os dados do perfil e libera o formulário após o sucesso
async function carregarPerfil() {
    try {
        const resposta = await fetch("/usuarios/perfil")

        if (resposta.status === 401) {
            window.location.replace("/login.html")
            return
        }

        const dados = await resposta.json()

        if (!resposta.ok) {
            window.alert(dados.erro || "Não foi possível carregar seu perfil.")
            return
        }

        campoNomePerfil.value = dados.nome
        campoEmailPerfil.value = dados.email
        campoAvatarPerfil.value = dados.avatar

        atualizarPreviaPerfil()

        formPerfil.hidden = false
        botaoSalvarPerfil.disabled = false
        botaoExcluirPerfil.disabled = false

    } catch (erro) {
        console.log("Erro ao carregar perfil:", erro)

        window.alert("Não foi possível carregar seu perfil. Tente novamente.")
    }
}

// envia os dados do perfil com a senha atual para confirmar a alteração
async function salvarPerfil(evento) {
    evento.preventDefault()

    if (botaoSalvarPerfil.disabled) {
        return
    }

    // remove espaços das pontas dos dados sem alterar a senha
    const usuario = {
        nome: campoNomePerfil.value.trim(),
        email: campoEmailPerfil.value.trim(),
        avatar: campoAvatarPerfil.value.trim() || ":D",
        senhaAtual: campoSenhaAtual.value
    }

    const campos = [
        campoNomePerfil,
        campoEmailPerfil,
        campoAvatarPerfil,
        campoSenhaAtual
    ]

    botaoSalvarPerfil.disabled = true
    botaoSalvarPerfil.innerText = "SALVANDO..."

    // bloqueia a edição dos campos enquanto aguarda a resposta
    campos.forEach((campo) => {
        campo.readOnly = true
    })

    try {
        const resposta = await fetch("/usuarios/perfil", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        })

        if (resposta.status === 401) {
            window.location.replace("/login.html")
            return
        }

        const dados = await resposta.json()

        if (!resposta.ok) {
            window.alert(dados.erro || "Não foi possível salvar seu perfil.")
            return
        }

        campoNomePerfil.value = usuario.nome
        campoEmailPerfil.value = usuario.email
        campoAvatarPerfil.value = usuario.avatar
        campoSenhaAtual.value = "" // limpa a senha atual depois da confirmação do salvamento

        atualizarPreviaPerfil()

        window.alert(dados.mensagem || "Perfil atualizado com sucesso.")

        // avisa a navegação para consultar a sessão e atualizar os dados da conta
        document.dispatchEvent(new Event("perfil-atualizado"))
    } catch (erro) {
        console.log("Erro ao salvar perfil:", erro)

        window.alert("Não foi possível confirmar o salvamento. Recarregue a página para conferir.")
    } finally {
        botaoSalvarPerfil.disabled = false
        botaoSalvarPerfil.innerText = "SALVAR ALTERAÇÕES"

        campos.forEach((campo) => {
            campo.readOnly = false
        })
    }
}

// confirma a exclusão e envia a senha atual ao servidor
async function excluirPerfil() {
    if (botaoExcluirPerfil.disabled || botaoSalvarPerfil.disabled) {
        return
    }

    const senhaAtual = campoSenhaAtual.value

    if (senhaAtual.length === 0) {
        window.alert("Informe sua senha atual para excluir a conta.")

        campoSenhaAtual.focus()
        return
    }

    // pede confirmação antes de enviar a exclusão permanente
    const confirmou = window.confirm(`
        Deseja excluir sua conta permanentemente? 
        Seus comentários também serão excluídos. 
        Essa ação não pode ser desfeita.`
    )

    if (!confirmou) {
        return
    }

    const campos = [
        campoNomePerfil,
        campoEmailPerfil,
        campoAvatarPerfil,
        campoSenhaAtual
    ]

    // registra se a exclusão foi confirmada pelo servidor
    let contaExcluida = false

    botaoExcluirPerfil.disabled = true
    botaoSalvarPerfil.disabled = true
    botaoExcluirPerfil.innerText = "EXCLUINDO..."

    // bloqueia a edição dos campos enquanto aguarda a resposta
    campos.forEach((campo) => {
        campo.readOnly = true
    })

    try {
        const resposta = await fetch("/usuarios/perfil", {
            method: "delete",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senhaAtual: senhaAtual
            })
        })

        if (resposta.status === 401) {
            window.location.replace("/login.html")
            return
        }

        const dados = await resposta.json()

        if (!resposta.ok) {
            window.alert(dados.erro || "Não foi possível excluir sua conta")
            return
        }

        contaExcluida = true
        campoSenhaAtual.value = ""

        window.alert(dados.mensagem)

        // volta ao início após a exclusão da conta
        window.location.replace("/")
        
    } catch (erro) {
        console.log("Erro ao excluir perfil:", erro)

        window.alert("Não foi possível confirmar a exclusão. Recarregue a página para verificar sua conta.")
    } finally {
        // libera os controles somente quando a exclusão não foi confirmada
        if (!contaExcluida) {
            botaoExcluirPerfil.disabled = false
            botaoSalvarPerfil.disabled = false
            botaoExcluirPerfil.innerText = "EXCLUIR CONTA"

            campos.forEach((campo) => {
                campo.readOnly = false
            })
        }
    }
}

botaoExcluirPerfil.addEventListener("click", excluirPerfil)

// atualiza a prévia conforme o usuário digita o avatar
campoAvatarPerfil.addEventListener("input", atualizarPreviaPerfil)

// busca os dados assim que o script é executado
carregarPerfil()

formPerfil.addEventListener("submit", salvarPerfil)