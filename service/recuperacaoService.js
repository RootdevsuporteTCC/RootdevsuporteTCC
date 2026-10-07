const recuperacaoModel = require("../model/recuperacaoModel")
const { gerarHash } = require("./criptografiaService")

async function criarRecuperacao(recuperacao, callback) {
    let codigoHash

    try {
        codigoHash = await gerarHash(recuperacao.codigo)
    } catch (erro) {
        callback(erro)
        return
    }

    const dadosRecuperacao = {
        userId: recuperacao.userId,
        codigoHash
    }
    
    recuperacaoModel.criarRecuperacao(dadosRecuperacao, callback)
}

async function concluirRecuperacao(recuperacao, novaSenha, callback) {
    let senhaHash

    try {
        senhaHash = await gerarHash(novaSenha)
    } catch (erro) {
        callback(erro)
        return
    }

    recuperacaoModel.concluirRecuperacao(recuperacao, senhaHash, callback)
}

module.exports = {
    criarRecuperacao,
    concluirRecuperacao
}