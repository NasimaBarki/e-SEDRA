'use strict'

// import moduli
const express = require('express')
var sequelize = require('../sequelize')
const path = require('path')
const fs = require('fs')

// file di configurazione
const configPath = './config.json'
const config = require('../config.json')

// cartella di setup
const setupFolder = './setup'

// setup router
const router = express.Router()

// controllo se il setup è già stato fatto
router.get('/setup', (req, res) => {
    if (config.install == 'true')
        res.status(200).json({ message: 'true' })
    else
        res.status(200).json({ message: 'false' })
})

router.post('/chklogin', async (req, res) => {
    try {
        await sequelize.authenticate()
        config.install = 'true'
        res.send('K')

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    } catch (error) {
        res.send('X')
    }
})

router.post('/setup/start', (req, res) => {
    console.log('body:', req.body)

    // cambiamento dati nel file config
    config.database.dbms = req.body.DBMS
    config.database.host = req.body.HOST
    config.database.name = req.body.DB
    config.database.user = req.body.USN
    config.database.password = req.body.PSW
    config.database.mailAdmin = req.body.MAILAD
    config.database.passwordAdmin = req.body.PSWAD
    config.database.emailLink = req.body.emailLink
    config.database.socialLink = req.body.socialLink
    config.database.webLink = req.body.webLink
    config.database.exists = req.body.DBEX
    config.sequelize = 'true'
    config.resume = req.body.resume

    // ritorna i nomi dei file nella cartella "setup"
    // il client poi farà una post per ogni endpoint
    var filesList = []

    fs.readdirSync(path.resolve(__dirname, setupFolder)).forEach(file => {
        filesList.push(file.split('.')[0].slice(4))
    })

    res.json(filesList)

    // il file viene modificato dopo aver mandato la risposta
    // perché quando il file viene modificato il server restarta
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
})

router.post('/setup/finish', (req, res) => {
    console.log(req.body)
    res.sendStatus(200)
})

module.exports = router