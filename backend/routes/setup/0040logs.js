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
let dtNow = ''

if (config.database.dbms == 'My SQL') {
    autoinc = 'AUTO_INCREMENT'
    dtNow = 'DEFAULT NULL'
}

else if (config.database.dbms == 'SQL Server') {
    autoinc = 'IDENTITY(1,1)'
    dtNow = 'DEFAULT getdate() NOT NULL'
}

let query = `CREATE TABLE logs
(
	idLg INT NOT NULL ` + autoinc + ` PRIMARY KEY,
	utente INT NOT NULL,
	dtStart DATETIME ` + dtNow + ` ,
	dtEnd DATETIME NULL, 
	FOREIGN KEY(utente) REFERENCES utenti(idUs) ON DELETE CASCADE
);`

router.post('/logs', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS logs'
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

        res.send('Table logs creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router