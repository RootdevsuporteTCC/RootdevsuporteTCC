const userModel = require("../model/userModel")
const { gerarHash } = require("./criptografiaService")

// gera o hash da senha antes de solicitar o cadastro ao model
async function criarUsuario(usuario, callback) {
    let senhaHash

    try {
        senhaHash = await gerarHash(usuario.senha)
    } catch (erro) {
        return callback(erro)
    }

    // prepara os dados para o model sem enviar a senha original
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