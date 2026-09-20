const campoAvatar = document.getElementById("avatar")
const previaAvatar = document.getElementById("avatar-previa")

// le o campo de avatar e atualiza a prévia com o texto digitado ou ":D"
function atualizarPreviaAvatar() {
    previaAvatar.innerText = campoAvatar.value || ":D"
}

// atualiza a prévia a cada alteração no campo de avatar
campoAvatar.addEventListener("input", atualizarPreviaAvatar)

// preenche a prévia inicial do avatar
atualizarPreviaAvatar()