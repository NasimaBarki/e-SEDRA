'use strict'

// import moduli
const express = require('express')
var sequelize = require('../sequelize')
const bcrypt = require('bcrypt')
var passport = require('passport')
var LocalStrategy = require('passport-local')


// file di configurazione
const configPath = './config.json'
const config = require('../config.json')

// query
let query = ''
let type = undefined

// setup router
const router = express.Router()

router.post('/login', async (req, res) => {
    let body = req.body
    let scPsw = 0

    // TODO: scPsw

    try {
        if (config.database.dbms == 'SQL Server') {

            query = 'Login @usn=\'' + body.EMAIL + '\', @scPsw=' + scPsw + ';'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL Login(:usn, :scPsw)'

            type = true
        }

        console.log(body.EMAIL)

        const results = await sequelize.query(query, {
            ...type && { replacements: { usn: body.EMAIL, scPsw: scPsw } },
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        const match = await bcrypt.compare(body.PSW, results[0][0].psw)

        if (results != 0 && match)
            res.send('K')
    } catch (error) {
        console.log(error)
        res.status(500).send('X')
    }
})

router.post('/chkloglogin', (req, res) => {
    res.sendStatus(200)
})

module.exports = router