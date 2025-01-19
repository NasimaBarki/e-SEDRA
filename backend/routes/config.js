'use strict'

// import moduli
const express = require('express')

// file di configurazione
const configPath = './config.json'
const config = require('../config.json')
const fs = require('fs')

// setup router
const router = express.Router()

const bodyParser = require('body-parser')
router.use(bodyParser.json()); // support json encoded bodies
router.use(express.urlencoded({ extended: true })); // support encoded bodies

router.get('/config', (req, res) => {
    let options = {}

    options.scPsw = config.scPsw
    options.ggMsgPsw = config.ggMsgPsw
    options.scTkn = config.scTkn
    options.emailNoRep = config.emailNoRep
    options.delLog = config.delLog
    options.BallottaggioBis = config.BallottaggioBis
    options.gradDefBisogni = config.gradDefBisogni

    res.json(JSON.stringify(options))
})

router.post('/config', (req, res) => {
    req.headers['content-type'] = 'application/x-www-form-urlencoded'
    let body = req.body
    config[body.item] = body.val

    console.log('BODY: ', body)

    fs.writeFileSync(configPath, JSON.stringify(config, null, 4))
})

module.exports = router