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

        const results = await sequelize.query(query, {
            ...type && { replacements: { usn: body.EMAIL, scPsw: scPsw } },
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        const match = await bcrypt.compare(body.PSW, results[0][0].psw)

        if (results != 0 && match) {
            results.pop()

            let results1 = []

            for (let i = 0; i < Object.keys(results).length; i++) {
                results1.push(results[1][i])
            }

            let rows = results1.map(item => item)

            let results0 = [results[0]['0']]

            let user = undefined

            if (rows.length >= 1) {
                user = results0[0]

                delete user.psw
                delete user.ruolo
                delete user.ruoloNU
                delete user.subruolo
                delete user.subruoloNU
                user.roles = {}

                rows.forEach(row => {
                    if (row.ruolo)
                        user.roles[row.ruoloNU] = [row.ruolo]

                    if (row.subruolo) {
                        let key = JSON.stringify(row.subruoloNU)
                        var obj = {}

                        obj[key] = row.subruolo

                        user.roles[row.ruoloNU].push(JSON.stringify(obj))
                    }
                })

                user["R"] = 'K'
            }

            console.log(user)

            res.send(user)
        }
        else {
            res.send({ 'R': 'X' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('X')
    }
})

router.post('/chkloglogin', (req, res) => {
    res.sendStatus(200)
})

module.exports = router