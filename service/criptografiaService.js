const bcrypt = require("bcrypt")

// define o custo de processamento usado para gerar os hashes
const RODADAS_HASH = 10

// gera o hash de uma senha ou código e retorna uma promise
function gerarHash(valor) {
    return bcrypt.hash(valor, RODADAS_HASH)
}

// compara o valor com o hash usando callback ou promise quando o callback não é informado
function compararHash(valor, hash, callback) {
    return bcrypt.compare(valor, hash, callback)
}

module.exports = {
    gerarHash,
    compararHash
}