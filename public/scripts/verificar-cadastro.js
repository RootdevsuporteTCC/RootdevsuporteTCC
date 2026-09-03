const form = document.querySelector("#formCadastro")

form.addEventListener("submit", (event) => {
    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const telefone = document.getElementById("telefone").value
    const senha = document.getElementById("senha").value
    const confirmarSenha = document.getElementById("confirmar-senha").value
    const avatar = document.getElementById("avatar").value

    if (senha !== confirmarSenha) {
        alert(senha)
        alert(confirmarSenha)
        event.preventDefault()
        alert("As senhas devem ser iguais")
    }
})