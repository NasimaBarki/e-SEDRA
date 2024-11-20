'use strict'

// import
const express = require('express')
const session = require('express-session')

const cors = require('cors')
const morgan = require('morgan')

const config = require('./config.json')

// router
var setupRouter = require('./routes/setup')
var logerrorRouter = require('./routes/logerror')
var loginRouter = require('./routes/login')
var configRouter = require('./routes/config')

// router setup
var dbRouter = require('./routes/setup/0000db')
var utentiRouter = require('./routes/setup/0001utenti')
var ambitiRouter = require('./routes/setup/0009ambiti')
var spGetAmbitiRouter = require('./routes/setup/0916spGetAmbiti')
var spSearchAmbitiRouter = require('./routes/setup/0928spSearchAmbiti')
var spUpdateAmbitiRouter = require('./routes/setup/0917spUpdateAmbiti')
var spLoginRouter = require('./routes/setup/0900spLogin')
var ruoliUtentiRouter = require('./routes/setup/0003ruoliUtenti')
var ruoliRouter = require('./routes/setup/0002ruoli')
var logsRouter = require('./routes/setup/0040logs')
var spSetLogLogoutRouter = require('./routes/setup/0909spSetLogLogout')
var spSetLogLoginRouter = require('./routes/setup/0908spSetLogLogin')
var spGetRuoliAllRouter = require('./routes/setup/0912spGetRuoliAll')
var spGetRuoliTreeRouter = require('./routes/setup/0911spGetRuoliTree')
var subRuoliRouter = require('./routes/setup/0004subRuoli')

// crea app express
const app = express()

app.use(morgan('tiny'))
app.use(cors())

app.use(express.json())

app.use(session({
    secret: config.sessionSecret, // Usa il segreto caricato dal file .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia in true se usi HTTPS
}))

// REST API
app.use('/', setupRouter)
app.use('/', logerrorRouter)
app.use('/', loginRouter)
app.use('/', configRouter)

// Setup
app.use('/', dbRouter)
app.use('/', ambitiRouter)
app.use('/', spGetAmbitiRouter)
app.use('/', spSearchAmbitiRouter)
app.use('/', spUpdateAmbitiRouter)
app.use('/', utentiRouter)
app.use('/', spLoginRouter)
app.use('/', ruoliUtentiRouter)
app.use('/', ruoliRouter)
app.use('/', logsRouter)
app.use('/', spSetLogLogoutRouter)
app.use('/', spSetLogLoginRouter)
app.use('/', spGetRuoliAllRouter)
app.use('/', spGetRuoliTreeRouter)
app.use('/', subRuoliRouter)

// attivazione server
app.listen(config.port, () => {
    console.log(`Server in esecuzione sulla porta ${config.port}`)
})
