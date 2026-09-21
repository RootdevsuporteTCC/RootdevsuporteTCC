require("dotenv").config() // carrega as variáveis do arquivo .env e sua biblioteca "dotenv" antes dos outros serviços

const express = require('express')
const path = require('path')
const session = require('express-session')

const userRoutes = require('./routes/userRoutes')
const admRoutes = require('./routes/admRoutes')
const conteudoRoutes = require('./routes/conteudoRoutes')
const comentarioRoutes = require('./routes/comentarioRoutes')
const recuperacaoRoutes = require("./routes/recuperacaoRoutes")

const conteudoController = require("./controller/conteudoController")

const app = express()
const port = 8000

// disponibiliza em req.body os dados enviados por formulários e json
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// disponibiliza os arquivos da pasta public para o navegador
app.use(express.static(path.join(__dirname, 'public')))

// configura a sessão usada pelas rotas para identificar o usuário
app.use(session({
    secret: "chave-legal-do-root-dev",  // chave usada para assinar o cookie da sessão
    resave: false,                      // evita salvar novamente uma sessão que não foi alterada
    saveUninitialized: false            // evita salvar sessões novas que ainda não receberam dados
}))

// encaminha cada grupo de rotas para seu arquivo de rotas
app.use('/usuarios', userRoutes)
app.use('/adm', admRoutes)
app.use('/conteudo', conteudoRoutes)
app.use('/comentarios', comentarioRoutes)
app.use("/recuperacao", recuperacaoRoutes)


// responde ao acesso da página inicial com o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// carrega as aulas na memória para a pesquisa antes de iniciar o servidor
conteudoController.carregarCacheConteudos()

// liga o server e começa a receber requisições na porta configurada
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})