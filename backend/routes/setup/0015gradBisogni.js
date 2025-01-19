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

if (config.database.dbms == 'My SQL')
    autoinc = 'AUTO_INCREMENT'
else if (config.database.dbms == 'SQL Server')
    autoinc = 'IDENTITY(1,1)'

let query = ` CREATE TABLE gradBisogni (
    idGB INT ${autoinc} NOT NULL PRIMARY KEY,
    ballot INT NOT NULL,
    idBs INT NOT NULL,
    idAm INT NOT NULL,
    grade INT NOT NULL,
    nlike INT,
    votanti INT,
    FOREIGN KEY (idBs) REFERENCES bisogni(idBs) ON DELETE NO ACTION,
    FOREIGN KEY (idAm) REFERENCES ambiti(idAm) ON DELETE NO ACTION
);`

router.post('/gradBisogni', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS gradBisogni'
    }

    try {
        if (resume) {
            await sequelize.query(resume, {
                type: sequelize.QueryTypes.DROP
            })
        }

        await sequelize.query(query)

        res.send('Table gradBisogni creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router
