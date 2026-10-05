const mysql = require("mysql2")

const variaveisObrigatorias = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME"
]

for (const nome of variaveisObrigatorias) {
    if (process.env[nome] === undefined) {
        throw new Error(`Configure ${nome} no arquivo .env`);
    }
}

const portaBanco = Number(process.env.DB_PORT || 3306)

if (!Number.isInteger(portaBanco) || portaBanco < 1 || portaBanco > 65535) {
    throw new Error("DB_PORT deve ser uma porta válida.");
}

const conexao = mysql.createPool({
    host: process.env.DB_HOST,
    port: portaBanco,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4_unicode_ci",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 100
})

module.exports = conexao