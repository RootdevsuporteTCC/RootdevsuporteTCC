const express = require('express')
const path = require('path')
const session = require('express-session')

const userRoutes = require('./routes/userRoutes')
const admRoutes = require('./routes/admRoutes')

const app = express()
const port = 8000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Define a pasta public como estática
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: "chave-legal-do-root-dev",  // chave usada para proteger o cookie da sessão
    resave: false,                      // evita ficar salvando a sessão sem necessidade
    saveUninitialized: false            // faz com que o express so salve a sessão se ela conter alguma informação
}))

// Rotas
app.use('/usuarios', userRoutes)
app.use('/adm', admRoutes)


// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})