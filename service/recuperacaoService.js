const recuperacaoModel = require("../model/recuperacaoModel")
const { gerarHash } = require("./criptografiaService")

// gera o hash do código antes de salvar a recuperação
async function criarRecuperacao(recuperacao, callback) {
    let codigoHash

    try {
        codigoHash = await gerarHash(recuperacao.codigo)
    } catch (erro) {
        callback(erro)
        return
    }

    // envia ao model o id da conta e o hash sem incluir o código original
    const dadosRecuperacao = {
        userId: recuperacao.userId,
        codigoHash
    }
    
    recuperacaoModel.criarRecuperacao(dadosRecuperacao, callback)
}

// gera o hash da nova senha antes de solicitar a conclusão ao model
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