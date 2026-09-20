const mysql = require('mysql2')

// cria a conexão com o banco usando as configurações definidas
const conexao = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'mydb'
})

// tenta conectar ao banco e faz o tratamento de erro
conexao.connect((erro) => {
    if (erro) {
        console.log('Erro ao conectar ao banco', erro)
        return
    }

    console.log('Banco conectado com sucesso!')
})

module.exports = conexao