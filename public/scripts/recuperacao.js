const formRecuperacao = document.getElementById("form-recuperacao")
const campoEmailRecuperacao = document.getElementById("email-recuperacao")
const botaoEnviarCodigo = document.getElementById("botao-enviar-codigo")
const mensagemRecuperacao = document.getElementById("mensagem-recuperacao")

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
    } catch (erro) {
        mensagemRecuperacao.innerText = "Não foi possível comunicar com o servidor. Tente novamente."
    } finally {
        botaoEnviarCodigo.disabled = false
        campoEmailRecuperacao.readOnly = false
        botaoEnviarCodigo.innerText = "Enviar código"
    }
}

formRecuperacao.addEventListener("submit", solicitarCodigo)