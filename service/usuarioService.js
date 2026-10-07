const userModel = require("../model/userModel")
const { gerarHash } = require("./criptografiaService")

async function criarUsuario(usuario, callback) {
    let senhaHash

    try {
        senhaHash = await gerarHash(usuario.senha)
    } catch (erro) {
        return callback(erro)
    }

    const dadosCadastro = {
        nome: usuario.nome,
        email: usuario.email,
        senhaHash,
        avatar: usuario.avatar || ":D"
    }
    
    userModel.criarUsuario(dadosCadastro, callback)
}

module.exports = {
    criarUsuario
}