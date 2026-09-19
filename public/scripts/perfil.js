const formPerfil = document.getElementById("form-perfil")
const campoNomePerfil = document.getElementById("nome")
const campoEmailPerfil = document.getElementById("email")
const campoAvatarPerfil = document.getElementById("avatar")
const previaAvatarPerfil = document.getElementById("avatar-previa")
const mensagemPerfil = document.getElementById("mensagem-perfil")
const campoSenhaAtual = document.getElementById("senha-atual")
const botaoSalvarPerfil = document.getElementById("botao-salvar-perfil")

function atualizarPreviaPerfil() {
    previaAvatarPerfil.innerText = campoAvatarPerfil.value || ":D"
}

async function carregarPerfil() {
    try {
        const resposta = await fetch("usuarios/perfil")

        if (resposta.status === 401) {
            window.location.replace("/login.html")
            return
        }

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagemPerfil.innerText = dados.erro || "Não foi possível carregar seu perfil."
            return
        }

        campoNomePerfil.value = dados.nome
        campoEmailPerfil.value = dados.email
        campoAvatarPerfil.value = dados.avatar

        atualizarPreviaPerfil()

        mensagemPerfil.hidden = true
        formPerfil.hidden = false
        botaoSalvarPerfil.disabled = false
    } catch (erro) {
        console.log("Erro ao carregar perfil:", erro)

        mensagemPerfil.innerText = "Não foi possível carregar seu perfil. Tente novamente."
    }
}

async function salvarPerfil(evento) {
    evento.preventDefault()

    if (botaoSalvarPerfil.disabled) {
        return
    }

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

    campos.forEach((campo) => {
        campo.readOnly = true
    })

    mensagemPerfil.hidden = false
    mensagemPerfil.innerText = "Salvando as alterações..."

    try {
        const resposta = await fetch("/usuarios/perfil", {
            method: "post",
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
            mensagemPerfil.innerText = dados.erro || "Não foi possível salvar seu perfil."
            return
        }

        campoNomePerfil.value = usuario.nome
        campoEmailPerfil.value = usuario.email
        campoAvatarPerfil.value = usuario.avatar
        campoSenhaAtual.value = ""

        atualizarPreviaPerfil()

        mensagemPerfil.innerText = dados.mensagem

        await verificarLogin()
    } catch (erro) {
        console.log("Erro ao salvar perfil:", erro)

        mensagemPerfil.innerText = "Não foi possível confirmar o salvamento. Recarregue a página para conferir."
    } finally {
        botaoSalvarPerfil.disabled = false
        botaoSalvarPerfil.innerText = "SALVAR ALTERAÇÕES"

        campos.forEach((campo) => {
            campo.readOnly = false
        })
    }
}

campoAvatarPerfil.addEventListener("input", atualizarPreviaPerfil)

carregarPerfil()

formPerfil.addEventListener("submit", salvarPerfil)