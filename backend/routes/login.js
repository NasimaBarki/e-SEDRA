'use strict'

// import moduli
const express = require('express')
var sequelize = require('../sequelize')
const bcrypt = require('bcrypt')
var passport = require('passport')
var LocalStrategy = require('passport-local')
const roles = require('../js/utilfunctions')

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
    let scPsw = config.scPsw

    try {
        if (config.database.dbms == 'SQL Server') {

            query = 'Login @email=\'' + body.EMAIL + '\', @scPsw=' + scPsw + ';'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL Login(:usn, :scPsw)'

            type = true
        }

        let results = await sequelize.query(query, {
            ...type && { replacements: { usn: body.EMAIL, scPsw: scPsw } },
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        const match = await bcrypt.compare(body.PSW, results[0][0].psw)

        //console.log(results)

        if (config.database.dbms == 'SQL Server') {
            let primoArray = results[0][0]
            let secondoArray = results[0][1]

            results = []
            results.push(primoArray)
            results.push(secondoArray)
        }

        let user = undefined
        if (results != 0 && match) {
            if (config.database.dbms == 'SQL Server') {
                // console.log('results: ', results)

                user = results[0]
                user['nome'] = results[1]['nome']
                user['cognome'] = results[1]['cognome']
                user['cell'] = results[1]['cell']
                user['cod'] = results[1]['cod']
                user['menuAct'] = results[1]['menuAct']
                user['dtPsw'] = results[1]['dtPsw']
                user['ggScPsw'] = results[1]['ggScPsw']

                user.roles = {}

                let results1 = []
                console.log('Results1: ', results[1])

                user["R"] = 'K'

                console.log('user: ', user)
                res.send(user)
            } else {
                results.pop()

                //console.log(results)
                let results1 = []

                for (let i = 0; i < Object.keys(results[1]).length; i++) {
                    results1.push(results[1][i])
                }

                user = roles.rolesToString(results1, 'idUs')
                user = user[0]

                delete user.psw
                delete user.ruoloNU
                delete user.subruolo
                delete user.subruoloNU

                let results0 = [results[0]['0']]
                user.dtStart = results0[0].dtStart
                user.ggScPsw = results0[0].ggScPsw

                user["R"] = 'K'
                // fa tutto la funzione, quindi non serve
                // let rows = results1.map(item => item)

                // let results0 = [results[0]['0']]

                // // console.log('Results0: ', results0)
                // // console.log('Results1: ', results1)

                // if (rows.length >= 1) {
                //     user = Object.assign({}, rows[0])

                //     user.dtStart = results0[0].dtStart
                //     user.ggScPsw = results0[0].ggScPsw

                //     delete user.psw
                //     delete user.ruolo
                //     delete user.ruoloNU
                //     delete user.subruolo
                //     delete user.subruoloNU
                //     user.roles = {}

                //     rows.forEach(row => {

                //         if (row.ruolo) {
                //             user.roles[row.ruoloNU] = [row.ruolo]
                //         }

                //         if (row.subruolo) {
                //             let key = JSON.stringify(row.subruoloNU)
                //             var obj = {}

                //             obj[key] = row.subruolo

                //             user.roles[row.ruoloNU].push(JSON.stringify(obj))
                //         }
                //     })

                // user["R"] = 'K'
            }
            console.log('user: ', user)
            res.send(user)
        }

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ 'R': 'X' })
    }
})

router.post('/chkloglogin', async (req, res) => {
    let user = req.body

    try {
        if (config.database.dbms == 'SQL Server') {

            query = 'setLogLogin @idUsr=\'' + user.idUs + '\', @dtLog=' + user.dtStart + ', @delLog=' + config.delLog + ';'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL setLogLogin(:idUsr, :dtLog, :delLog)'

            type = true
        }

        await sequelize.query(query, {
            ...type && { replacements: { idUsr: user.idUs, dtLog: user.dtStart, delLog: config.delLog } },
            ...type && { type: sequelize.QueryTypes.INSERT }
        })

        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).send('Impossibile fare il logout')
    }
})

router.post('/logout', async (req, res) => {
    let body = JSON.parse(req.body.data)

    console.log(body)

    try {
        if (config.database.dbms == 'SQL Server') {

            query = 'setLogLogout @idUsr=\'' + body.idUs + '\', @dtLog=' + body.dtStart + ';'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL setLogLogout(:idUsr, :dtLog)'

            type = true
        }

        await sequelize.query(query, {
            ...type && { replacements: { idUsr: body.idUs, dtLog: body.dtStart } },
            ...type && { type: sequelize.QueryTypes.UPDATE }
        })

        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).send('Impossibile fare il logout')
    }
})

module.exports = router