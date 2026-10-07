const bcrypt = require("bcrypt")

const RODADAS_HASH = 10

function gerarHash(valor) {
    return bcrypt.hash(valor, RODADAS_HASH)
}

function compararHash(valor, hash, callback) {
    return bcrypt.compare(valor, hash, callback)
}

module.exports = {
    gerarHash,
    compararHash
}