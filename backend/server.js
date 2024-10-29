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

// router setup
var ambitiRouter = require('./routes/setup/ambiti')
var spGetAmbitiRouter = require('./routes/setup/spGetAmbiti')
var spSearchAmbitiRouter = require('./routes/setup/spSearchAmbiti')
var spUpdateAmbitiRouter = require('./routes/setup/spUpdateAmbiti')

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

// Setup
app.use('/', ambitiRouter)
app.use('/', spGetAmbitiRouter)
app.use('/', spSearchAmbitiRouter)
app.use('/', spUpdateAmbitiRouter)

// attivazione server
app.listen(config.port, () => {
    console.log(`Server in esecuzione sulla porta ${config.port}`)
})
