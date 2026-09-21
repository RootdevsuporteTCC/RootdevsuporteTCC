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

// guarda o email usado na solicitação para enviar junto com o código
let emailSolicitado = ""

// recebe o envio do formulário, envia o email e mostra a etapa de código após a resposta
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
                "Content-Type": "application/json"  // diz que os dados estão em formato json
            },
            body: JSON.stringify({ email: email }) // transforma o objeto json em uma string json para ser enviado
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mensagemRecuperacao.innerText = dados.erro || "Não foi possível solicitar a recuperação."
            return
        }

        mensagemRecuperacao.innerText = dados.mensagem

        // mantém o email da solicitação para a próxima etapa
        emailSolicitado = email

        // troca o formulário de email pelo formulário do código
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

// recebe o envio do formulário, envia email e código e mostra a nova senha após a validação
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

    // controla se a etapa do código já foi concluída
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
                "Content-Type": "application/json"  // diz que os dados estão em formato json
            },
            body: JSON.stringify({ // transforma o objeto json em uma string json para ser enviado
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

        // limpa e mostra os campos para cadastrar a nova senha
        formNovaSenha.reset()
        formNovaSenha.hidden = false

        campoNovaSenha.focus()
    
    } catch (erro) {
        mensagemRecuperacao.innerText = "Não foi possível comunicar com o servidor. Tente novamente."
    } finally {
        botaoVoltarEmail.disabled = false

        // mantém o código bloqueado quando a verificação já foi concluída
        botaoVerificarCodigo.disabled = verificado
        campoCodigo.readOnly = verificado

        if (verificado) {
            botaoVerificarCodigo.innerText = "Código verificado"
        } else {
            botaoVerificarCodigo.innerText = "Verificar código"
        }
    }
}

// recebe o envio do formulário, envia senha e confirmação e mostra a conclusão após o sucesso
async function salvarNovaSenha(evento) {
    evento.preventDefault()

    if (botaoSalvarSenha.disabled) {
        return
    }

    // lê as senhas sem remover espaços dos valores digitados
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
                "Content-Type": "application/json"  // diz que os dados estão em formato json
            },
            body: JSON.stringify({ // transforma o objeto json em uma string json para ser enviado
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

        // mostra o acesso ao login depois da confirmação da troca de senha
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

// encaminha o envio de cada formulário para sua etapa da recuperação
formRecuperacao.addEventListener("submit", solicitarCodigo)
formCodigo.addEventListener("submit", verificarCodigoInformado)
formNovaSenha.addEventListener("submit", salvarNovaSenha)

// volta para a etapa do email e limpa os dados da verificação na interface
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