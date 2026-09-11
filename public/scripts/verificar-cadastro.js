const form = document.getElementById("formCadastro")
const nome = document.getElementById("nome").value
const email = document.getElementById("email").value
const telefone = document.getElementById("telefone").value
const senha = document.getElementById("senha").value
const confirmarSenha = document.getElementById("confirmar-senha").value
const avatar = document.getElementById("avatar").value


form.addEventListener("submit", (event) => {
    if (senha !== confirmarSenha) {
        event.preventDefault()
        alert("As senhas devem ser iguais")
    }

    if (nome.includes("@")) {
        event.preventDefault()
        alert("O nome de usuário não pode conter @")
    }
})

const campoAvatar = document.getElementById("avatar")
const previaAvatar = document.getElementById("avatar-previa")

function atualizarPreviaAvatar() {
    previaAvatar.innerText = campoAvatar.value || ":D"
}

campoAvatar.addEventListener("input", atualizarPreviaAvatar)

atualizarPreviaAvatar()