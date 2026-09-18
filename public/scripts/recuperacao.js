const formRecuperacao           =  document.getElementById("form-recuperacao")
const campoEmailRecuperacao     =  document.getElementById("email-recuperacao")
const botaoEnviarCodigo         =  document.getElementById("botao-enviar-codigo")
const mensagemRecuperacao       =  document.getElementById("mensagem-recuperacao")
const formCodigo                =  document.getElementById("form-codigo")
const campoCodigo               =  document.getElementById("codigo-recuperacao")
const botaoVoltarEmail          =  document.getElementById("botao-voltar-email")
const botaoVerificarCodigo      =  document.getElementById("botao-verificar-codigo")
const formNovaSenha             =  document.getElementById("form-nova-senha")
const campoNovaSenha            =  document.getElementById("nova-senha")
const campoConfirmarNovaSenha   =  document.getElementById("confirmar-nova-senha")
const botaoSalvarSenha          =  document.getElementById("botao-salvar-senha")
const areaRecuperacaoConcluida  =  document.getElementById("recuperacao-concluida")

let emailSolicitado = ""

async function solicitarCodigo(evento) {
    evento.preventDefault()

    if (botaoEnviarCodigo.disabled) {
        return
    }

    const email = campoEmailRecuperacao.value.trim()

    botaoEnviarCodigo.disabled = true
    campoEmailRecuperacao.readOnly = true
    botaoEnviarCodigo.innerText = "Aguarde..."

    mensagemRecuperacao.hidden = false
    mensagemRecuperacao.innerText = "Solicitando código..."

    try {
        const resposta = await fetch("/recuperacao/solicitar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagemRecuperacao.innerText = dados.erro || "Não foi possível solicitar a recuperação."
            return
        }

        mensagemRecuperacao.innerText = dados.mensagem

        emailSolicitado = email

        formRecuperacao.hidden = true
        formCodigo.hidden = false

        campoCodigo.value = ""
        campoCodigo.focus()

    } catch (erro) {
        mensagemRecuperacao.innerText = "Não foi possível comunicar com o servidor. Tente novamente."
    } finally {
        botaoEnviarCodigo.disabled = false
        campoEmailRecuperacao.readOnly = false
        botaoEnviarCodigo.innerText = "Enviar código"
    }
}

async function verificarCodigoInformado(evento) {
    evento.preventDefault()

    if (botaoVerificarCodigo.disabled) {
        return
    }

    mensagemRecuperacao.hidden = false

    if (!emailSolicitado) {
        mensagemRecuperacao.innerText = "Volte e solicite um código de recuperação."
        return
    }

    const codigo = campoCodigo.value.trim().toUpperCase()
    let verificado = false

    botaoVerificarCodigo.disabled = true
    botaoVoltarEmail.disabled = true
    campoCodigo.readOnly = true

    botaoVerificarCodigo.innerText = "Verificando..."
    mensagemRecuperacao.innerText = "Verificando o código..."

    try {
        const resposta = await fetch("/recuperacao/verificar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailSolicitado,
                codigo: codigo
            })
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagemRecuperacao.innerText = dados.erro || "Não foi possível verificar o código."
            return
        }

        verificado = true
        mensagemRecuperacao.innerText = dados.mensagem

        formCodigo.hidden = true

        formNovaSenha.reset()
        formNovaSenha.hidden = false

        campoNovaSenha.focus()
    
    } catch (erro) {
        mensagemRecuperacao.innerText = "Não foi possível comunicar com o servidor. Tente novamente."
    } finally {
        botaoVoltarEmail.disabled = false

        botaoVerificarCodigo.disabled = verificado
        campoCodigo.readOnly = verificado

        if (verificado) {
            botaoVerificarCodigo.innerText = "Código verificado"
        } else {
            botaoVerificarCodigo.innerText = "Verificar código"
        }
    }
}

async function salvarNovaSenha(evento) {
    evento.preventDefault()

    if (botaoSalvarSenha.disabled) {
        return
    }

    const senha = campoNovaSenha.value
    const confirmarSenha = campoConfirmarNovaSenha.value
    
    mensagemRecuperacao.hidden = false

    if (senha !== confirmarSenha) {
        mensagemRecuperacao.innerText = "As senhas devem ser iguais."
        return
    }

    botaoSalvarSenha.disabled = true
    botaoSalvarSenha.innerText = "Salvando..."

    campoNovaSenha.readOnly = true
    campoConfirmarNovaSenha.readOnly = true

    mensagemRecuperacao.innerText = "Salvando sua nova senha..."

    try {
        const resposta = await fetch("/recuperacao/redefinir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senha: senha,
                confirmarSenha: confirmarSenha
            })
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagemRecuperacao.innerText = dados.erro || "Não foi possível alterar a senha."
            return
        }

        formNovaSenha.reset()
        formNovaSenha.hidden = true

        mensagemRecuperacao.innerText = dados.mensagem
        areaRecuperacaoConcluida.hidden = false

    } catch (erro) {
        mensagemRecuperacao.innerText = "Não foi possível confirmar a resposta do servidor. Verifique sua conexão"
    } finally {
        botaoSalvarSenha.disabled = false
        botaoSalvarSenha.innerText = "Salvar senha"

        campoNovaSenha.readOnly = false
        campoConfirmarNovaSenha.readOnly = false
    }
}

formRecuperacao.addEventListener("submit", solicitarCodigo)
formCodigo.addEventListener("submit", verificarCodigoInformado)
formNovaSenha.addEventListener("submit", salvarNovaSenha)

botaoVoltarEmail.addEventListener("click", () => {
    formCodigo.hidden = true
    formRecuperacao.hidden = false

    campoCodigo.value = ""
    campoCodigo.readOnly = false

    botaoVerificarCodigo.disabled = false
    botaoVerificarCodigo.innerText = "Verificar código"

    emailSolicitado = ""

    mensagemRecuperacao.innerText = ""
    mensagemRecuperacao.hidden = true

    campoEmailRecuperacao.focus()
})