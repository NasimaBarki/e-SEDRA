'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')

// setup router
const router = express.Router()

// query
let resume = ''
let autoinc = ''

let queryInsert = `INSERT INTO ruoliUtenti (utente, ruolo) VALUES (1,1)`

if (config.database.dbms == 'My SQL') {
    autoinc = 'AUTO_INCREMENT'
}

else if (config.database.dbms == 'SQL Server') {
    autoinc = 'IDENTITY(1,1)'
}

let query = `CREATE TABLE ruoliUtenti  \
    ( \
        idRlUs INT ` + autoinc + ` NOT NULL PRIMARY KEY, \
        utente INT NOT NULL, \
        ruolo  INT NOT NULL, \
        subruolo INT, \
        FOREIGN KEY (utente) REFERENCES utenti(idUs) ON DELETE CASCADE, \
        FOREIGN KEY (ruolo) REFERENCES ruoli(IdRl) ON DELETE CASCADE, \
        FOREIGN KEY (subruolo) REFERENCES ruoli(IdRl) ON DELETE NO ACTION \
    )`

router.post('/ruoliUtenti', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS ruoliUtenti'
    }

    try {
        if (resume) {
            await sequelize.query(resume, {
                type: sequelize.QueryTypes.DROP
            })
        }

        await sequelize.query(query, {
            type: sequelize.QueryTypes.CREATE
        })

        await sequelize.query(queryInsert, {
            type: sequelize.QueryTypes.INSERT
        })

        res.send('Table ruoli utenti creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router