'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const formData = require('express-form-data')
const config = require('../../config.json')

// setup router
const router = express.Router()
router.use(formData.parse())

// query
let resume = ''
let autoinc = undefined
let dtNow = undefined

if (config.database.dbms == 'My SQL') {
    autoinc = 'AUTO_INCREMENT'
    dtNow = 'DEFAULT NULL'
}

else if (config.database.dbms == 'SQL Server') {
    autoinc = 'IDENTITY(1,1)'
    dtNow = 'DEFAULT getdate() NOT NULL'
}

let query = `CREATE TABLE proposte (
    idPr INT ${autoinc} NOT NULL PRIMARY KEY,
    dtIns   DATETIME ${dtNow},
    utente INT NOT NULL,
    proponente VARCHAR(40),
    email VARCHAR(30),
    tel VARCHAR(20),
	titlePrp VARCHAR(60) NOT NULL,
    textPrp VARCHAR(2048),
    pdforigname VARCHAR(40),
	pdfalleg VARCHAR(20),
    rifbisgenerico VARCHAR(40),
    deleted INT NOT NULL DEFAULT 0,
    ingrad INT NOT NULL DEFAULT 0,
    pubblicato TINYINT NOT NULL,
	aggiornato DATETIME,
    dtRev DATETIME,
    rev VARCHAR(60),
    revisore INT,
    FOREIGN KEY (utente) REFERENCES utenti(idUs) ON DELETE NO ACTION,
    FOREIGN KEY (revisore) REFERENCES utenti(idUs) ON DELETE SET NULL
);`

router.post('/proposte', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS proposte'
    }

    try {
        if (resume) {
            await sequelize.query(resume, {
                type: sequelize.QueryTypes.DROP
            })
        }

        await sequelize.query(query)

        res.send('Table proposte creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router
