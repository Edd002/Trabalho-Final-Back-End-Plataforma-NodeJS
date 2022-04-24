require('dotenv').config()
const express = require('express')

console.log('Tipo do Express: ' + JSON.stringify(express))

const morgan = require('morgan')
const routerAPI = require('./routers/routerAPI')
const routerSec = require('./routers/routerSec')
const app = express()

app.use(express.urlencoded({ extended: true })) // Processa o body em formato URLEncoded
app.use(express.json()) // Processa o body em formato JSON
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'))

app.use('/app', express.static('public', { index: false, cacheControl: 'public' }))
app.use('/api', routerAPI)
app.use('/seguranca', routerSec)

const PORTA = process.env.PORT || 3000
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
})