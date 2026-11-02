const mysql = require("mysql2")

const variaveisObrigatorias = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME"
]

// interrompe a configuração quando uma variável obrigatória não foi definida
for (const nome of variaveisObrigatorias) {
    if (process.env[nome] === undefined) {
        throw new Error(`Configure ${nome} no arquivo .env`);
    }
}

const portaBanco = Number(process.env.DB_PORT || 3306)

// exige uma porta inteira entre 1 e 65535
if (!Number.isInteger(portaBanco) || portaBanco < 1 || portaBanco > 65535) {
    throw new Error("DB_PORT deve ser uma porta válida.");
}

// cria o pool compartilhado pelos models com as configurações do env
const conexao = mysql.createPool({
    host: process.env.DB_HOST,
    port: portaBanco,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4_unicode_ci", // permite a comunicação com suporte a emojis
    waitForConnections: true, // aguarda uma conexão livre quando o pool está ocupado
    connectionLimit: 10, // limita a quantidade de conexões do pool
    queueLimit: 100 // limita a quantidade de solicitações na fila de espera
})

module.exports = conexao