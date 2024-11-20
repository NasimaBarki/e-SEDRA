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
let type = undefined
let queryInsert = `INSERT INTO subRuoli (ruolo, subruolo) VALUES
(2,7),(2,8),(2,9),(2,10),(3,8),(3,10),(4,8),(4,10),(5,7),(5,8),(5,10),(3,12),(2,11),(3,11),(4,11),(5,11);`

if (config.database.dbms == 'My SQL')
    autoinc = 'AUTO_INCREMENT'
else if (config.database.dbms == 'SQL Server')
    autoinc = 'IDENTITY(1,1)'

let query = `CREATE TABLE subRuoli (
    idSbRl INT ${autoinc} NOT NULL PRIMARY KEY,
    ruolo  INT NOT NULL,
    subRuolo INT NOT NULL,
    FOREIGN KEY (ruolo) REFERENCES ruoli(IdRl) ON DELETE CASCADE,
    FOREIGN KEY (subRuolo) REFERENCES ruoli(IdRl) ON DELETE NO ACTION
);`

router.post('/subRuoli', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS subRuoli'
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

        res.send('Table subRuoli creata')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router