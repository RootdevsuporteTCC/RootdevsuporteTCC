// tenta copiar o email de contato e mostra o endereço no alert se a cópia falhar
async function emailToClipboard() {
    const email = "rootdevsuporte@gmail.com"

    try {
        await navigator.clipboard.writeText(email)

        alert("E-mail copiado para a área de transferência.")
    } catch (erro) {
        console.error("Erro ao copiar e-mail:", erro)
        
        alert(`Não foi possível copiar automaticamente. Copie este e-mail: ${email}`)
    }
}