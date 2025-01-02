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

if (config.database.dbms == 'My SQL') {
    autoinc = 'AUTO_INCREMENT'
    type = true
}
else if (config.database.dbms == 'SQL Server') {
    autoinc = 'IDENTITY(1,1)'
    type = false
}

let query = `CREATE TABLE attRuoli (
    idAR INT ` + autoinc + ` NOT NULL PRIMARY KEY,
    activity INT NOT NULL,
    ruolo INT NOT NULL,
    sottoruolo INT,
    FOREIGN KEY (activity) REFERENCES attivita(idAt) ON DELETE CASCADE,
    FOREIGN KEY (ruolo) REFERENCES ruoli(idRl) ON DELETE NO ACTION,
    FOREIGN KEY (sottoruolo) REFERENCES ruoli(idRl) ON DELETE NO ACTION
);`

router.post('/attRuoli', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS attRuoli'
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


        res.send('Table attRuoli creata')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router