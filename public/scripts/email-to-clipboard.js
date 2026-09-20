// adiciona o email de contato na área de transferência do usuario e mostra um aviso na tela
function emailToClipboard() {
    navigator.clipboard.writeText("rootdevsuporte@gmail.com")
    alert("Email copiado para a área de transferência.")
}