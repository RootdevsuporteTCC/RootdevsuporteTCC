require("dotenv").config() // carrega o env antes dos módulos que usam suas configurações

const express = require('express')
const path = require('path')
const session = require('express-session')

const conexao = require("./config/database")

const tratarErros = require("./middleware/tratarErros")
const alertaErros = require("./middleware/alertaErros")

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

// prepara os alerts antes da leitura dos dados para também apresentar erros dessa etapa
app.use(alertaErros)

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

// liga cada grupo de links ao arquivo de rotas correspondente
app.use('/usuarios', userRoutes)
app.use('/adm', admRoutes)
app.use('/conteudo', conteudoRoutes)
app.use('/comentarios', comentarioRoutes)
app.use("/recuperacao", recuperacaoRoutes)

// trata os erros encaminhados pelas rotas e middlewares
app.use(tratarErros)

// testa o acesso ao banco antes de carregar as aulas e iniciar o servidor
conexao.query("SELECT 1", (erro) => {
    if (erro) {
        console.log("Não foi possível iniciar: falha na conexão com o banco.", erro.code)

        // encerra o pool e sinaliza a falha sem iniciar o servidor http
        conexao.end(() => {
            process.exitCode = 1
        })

        return
    }

    console.log("Banco conectado com sucesso!")

    // prepara o cache usado pelo menu pelas aulas e pela pesquisa
    conteudoController.carregarCacheConteudos()

    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`)
    })
})