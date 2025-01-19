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

let query = ` CREATE TABLE token
(
	idTk INT NOT NULL $autoinc PRIMARY KEY,
	utente INT NOT NULL,
	token VARCHAR(10) NOT NULL UNIQUE,
	dtExp DATETIME,
	FOREIGN KEY(utente) REFERENCES utenti(idUs) ON DELETE CASCADE
);`

router.post('/token', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS token'
    }

    try {
        if (resume) {
            await sequelize.query(resume, {
                type: sequelize.QueryTypes.DROP
            })
        }

        await sequelize.query(query)

        res.send('Table token creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router
