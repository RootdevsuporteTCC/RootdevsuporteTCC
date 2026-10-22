function normalizarUsuario(usuario) {
    let avatar = usuario.avatar

    if (avatar === undefined) {
        avatar = ":D"
    }

    if (typeof avatar === "string") {
        avatar = avatar.trim() || ":D"
    }

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