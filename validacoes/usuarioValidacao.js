// recebe os dados do usuário e normaliza nome, email e avatar
// retorna uma mensagem de erro ou null quando os dados são válidos
function validarDadosUsuario(usuario) {
    if (typeof usuario.nome !== "string" || typeof usuario.email !== "string") {
        return "Informe o nome de usuário e o e-mail."
    }

    if (usuario.avatar === undefined) {
        usuario.avatar = ""
    }

    if (typeof usuario.avatar !== "string") {
        return "O avatar deve ser um texto."
    }

    usuario.nome = usuario.nome.trim()
    usuario.email = usuario.email.trim()
    usuario.avatar = usuario.avatar.trim()

    if (usuario.nome.length < 3 || usuario.nome.length > 80) {
        return "O nome de usuário deve ter entre 3 e 80 caracteres."
    }

    if (/[\s@]/.test(usuario.nome)) {
        return "O nome de usuário não pode conter espaços ou @."
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (usuario.email.length > 254 || !emailRegex.test(usuario.email)) {
        return "Informe um e-mail válido com até 254 caracteres."
    }

    if (usuario.avatar.length > 10) {
        return "O avatar deve ter até 10 caracteres."
    }

    if (usuario.avatar === "") {
        usuario.avatar = ":D"
    }

    return null
}

// recebe a senha e sua confirmação e verifica as regras de cadastro
// retorna uma mensagem de erro ou null quando a senha é válida
function validarSenha(senha, confirmarSenha) {
    if (typeof senha !== "string" || typeof confirmarSenha !== "string") {
        return "Informe a senha e sua confirmação."
    }

    if (senha.length < 8 || senha.length > 64) {
        return "A senha deve ter entre 8 e 64 caracteres."
    }

    // verifica os bytes para evitar que o bcrypt ignore parte da senha
    if (Buffer.byteLength(senha, "utf8") > 72) {
        return "A senha ficou muito longa. Reduza o texto e tente novamente."
    }

    if (!/[0-9]/.test(senha)) {
        return "A senha deve conter pelo menos um número."
    }

    if (!/[!@#$%&*?._+-]/.test(senha)) {
        return "A senha deve conter pelo menos um destes símbolos: ! @ # $ % & * ? . _ + -"
    }

    if (senha !== confirmarSenha) {
        return "As senhas devem ser iguais."
    }

    return null
}

module.exports = {
    validarDadosUsuario,
    validarSenha
}