// prepara nome email e avatar antes da validação
function normalizarUsuario(usuario) {
    let avatar = usuario.avatar

    // usa o avatar padrão quando o campo não foi enviado
    if (avatar === undefined) {
        avatar = ":D"
    }

    // ajusta apenas textos e mantém outros tipos para a validação recusar
    if (typeof avatar === "string") {
        avatar = avatar.trim() || ":D"
    }

    // cria outro objeto sem alterar o original nem o valor da senha
    return {
        ...usuario,
        nome: typeof usuario.nome === "string" ? usuario.nome.trim() : usuario.nome,
        email: typeof usuario.email === "string" ? usuario.email.trim() : usuario.email,
        avatar
    }
}

module.exports = {
    normalizarUsuario
}