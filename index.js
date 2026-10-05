require("dotenv").config() // carrega as variáveis do arquivo .env e sua biblioteca "dotenv" antes dos outros serviços

const express = require('express')
const path = require('path')
const session = require('express-session')

const conexao = require("./config/database")

const userRoutes = require('./routes/userRoutes')
const admRoutes = require('./routes/admRoutes')
const conteudoRoutes = require('./routes/conteudoRoutes')
const comentarioRoutes = require('./routes/comentarioRoutes')
const recuperacaoRoutes = require("./routes/recuperacaoRoutes")

const conteudoController = require("./controller/conteudoController")

const app = express()
const port = Number(process.env.PORT || 8000)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT deve ser uma porta válida.");
}

if (!process.env.SESSION_SECRET) {
    throw new Error("Configure SESSION_SECRET no arquivo .env")
}

// disponibiliza em req.body os dados enviados por formulários e json
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// disponibiliza os arquivos da pasta public para o navegador
app.use(express.static(path.join(__dirname, 'public')))

// configura a sessão usada pelas rotas para identificar o usuário
app.use(session({
    secret: process.env.SESSION_SECRET,  // chave usada para assinar o cookie da sessão
    resave: false,                      // evita salvar novamente uma sessão que não foi alterada
    saveUninitialized: false            // evita salvar sessões novas que ainda não receberam dados
}))

// encaminha cada grupo de rotas para seu arquivo de rotas
app.use('/usuarios', userRoutes)
app.use('/adm', admRoutes)
app.use('/conteudo', conteudoRoutes)
app.use('/comentarios', comentarioRoutes)
app.use("/recuperacao", recuperacaoRoutes)

// confere o acesso ao banco antes de iniciar o servidor
conexao.query("SELECT 1", (erro) => {
    if (erro) {
        console.log("Não foi possível iniciar: falha na conexão com o banco.", erro.code)

        conexao.end(() => {
            process.exitCode = 1
        })

        return
    }

    console.log("Banco conectado com sucesso!")

    conteudoController.carregarCacheConteudos()

    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`)
    })
})