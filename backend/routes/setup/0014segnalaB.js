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
let autoinc, dtNow = undefined
if (config.database.dbms == 'My SQL') {
    autoinc = 'AUTO_INCREMENT'
    dtNow = 'DEFAULT NULL'
}
else if (config.database.dbms == 'SQL Server') {
    autoinc = 'IDENTITY(1,1)'
    dtNow = 'DEFAULT getdate() NOT NULL'
}

let query = `CREATE TABLE segnalaCommB (
    idSC INT ${autoinc} NOT NULL PRIMARY KEY,
    dtIns   DATETIME ${dtNow},
    utente INT,
    commento INT NOT NULL,
    FOREIGN KEY (utente) REFERENCES utenti(idUs) ON DELETE NO ACTION,
    FOREIGN KEY (commento) REFERENCES blogB(idBl) ON DELETE CASCADE
);`

router.post('/segnalaB', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS segnalaB'
    }

    try {
        if (resume) {
            await sequelize.query(resume, {
                type: sequelize.QueryTypes.DROP
            })
        }

        await sequelize.query(query)

        res.send('Table segnalaCommB creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router