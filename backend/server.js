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
var spUpdRuoliRouter = require('./routes/setup/0915spUpdRuoli')
var spGetLogDataRouter = require('./routes/setup/0949spGetLogData')
var spGetAllUsersRouter = require('./routes/setup/0922spGetAllUsers')
var spGetOneUserRouter = require('./routes/setup/0927spGetOneUser')
var spGetRuoliSecRouter = require('./routes/setup/0921spGetRuoliSec')
var spSetDataUserRouter = require('./routes/setup/0924spSetDataUser')
var spSetRoleUserRouter = require('./routes/setup/0925spSetRoleUser')
var spDelUserRouter = require('./routes/setup/0926spDelUser')
var spGetDupMailRouter = require('./routes/setup/0923spGetDupMail')
var spDelRolesUserRouter = require('./routes/setup/0929spDelRolesUser')
var attivitaRouter = require('./routes/setup/0006attivita')
var spGetRolesActivityRouter = require('./routes/setup/0934spGetRolesActivity')
var attRuoliRouter = require('./routes/setup/0007attRuoli')
var numberOfStarsRouter = require('./routes/setup/0030numberOfStars')
var spGetMomentRouter = require('./routes/setup/0913spGetMoment')
var bisogniRouter = require('./routes/setup/0010bisogni.js')
var spSetUpdBisogniRouter = require('./routes/setup/0930spSetUpdBisogni.js')
var spDelBisogniRouter = require('./routes/setup/0931spDelBisogni.js')
var spGetSingleBisognoRouter = require('./routes/setup/0932spGetSingleBisogno.js')
var spRevBisogniRouter = require('./routes/setup/0938spRevBisogni.js')
var valBisRouter = require('./routes/setup/0011valBis.js')
var miPiaceBRouter = require('./routes/setup/0013miPiaceB.js')
var spGetActConfRouter = require('./routes/setup/0935spGetActConf.js')
var spGetMaxStarRouter = require('./routes/setup/0936spGetMaxStar.js')
var spGetNrVotiRouter = require('./routes/setup/0937spGetNrVoti.js')
var spUpdValBisRouter = require('./routes/setup/0919spUpdValBis.js')
var blogBRouter = require('./routes/setup/0012blogB.js')
var segnalaBRouter = require('./routes/setup/0014segnalaB.js')

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
app.use('/', attivitaRouter)

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
app.use('/', spUpdRuoliRouter)
app.use('/', spGetLogDataRouter)
app.use('/', spGetAllUsersRouter)
app.use('/', spGetOneUserRouter)
app.use('/', spGetRuoliSecRouter)
app.use('/', spSetDataUserRouter)
app.use('/', spSetRoleUserRouter)
app.use('/', spDelUserRouter)
app.use('/', spGetDupMailRouter)
app.use('/', spDelRolesUserRouter)
app.use('/', spGetRolesActivityRouter)
app.use('/', attRuoliRouter)
app.use('/', numberOfStarsRouter)
app.use('/', spGetMomentRouter)
app.use('/', bisogniRouter)
app.use('/', spSetUpdBisogniRouter)
app.use('/', spDelBisogniRouter)
app.use('/', spGetSingleBisognoRouter)
app.use('/', spRevBisogniRouter)
app.use('/', valBisRouter)
app.use('/', miPiaceBRouter)
app.use('/', spGetActConfRouter)
app.use('/', spGetMaxStarRouter)
app.use('/', spGetNrVotiRouter)
app.use('/', spUpdValBisRouter)
app.use('/', blogBRouter)
app.use('/', segnalaBRouter)

// attivazione server
app.listen(config.port, () => {
    console.log(`Server in esecuzione sulla porta ${config.port}`)
})
