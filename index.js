const express = require('express')
const path = require('path')

const userRoutes = require('./routes/userRoutes')
const admRoutes = require('./routes/admRoutes')

const app = express()
const port = 8000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Define a pasta public como estática
app.use(express.static(path.join(__dirname, 'public')))

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