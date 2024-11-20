'use strict'

// import moduli
const express = require('express')


// file di configurazione
const configPath = './config.json'
const config = require('../config.json')

// setup router
const router = express.Router()

router.get('/config', (req, res) => {
    let options = {}

    options.scPsw = config.scPsw
    options.ggMsgPsw = config.ggMsgPsw
    options.scTkn = config.scTkn
    options.emailNoRep = config.emailNoRep
    options.delLog = config.delLog

    res.json(JSON.stringify(options))
})

router.post('/config/:key', (req, res) => {
    let key = req.query.key
    let body = req.body

    console.log('KEY: ', key, '\nBODY: ', body)
})

module.exports = router