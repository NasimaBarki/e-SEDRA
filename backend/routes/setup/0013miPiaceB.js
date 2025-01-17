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

let query = `CREATE TABLE miPiaceB (
    idmi INT ${autoinc} NOT NULL PRIMARY KEY,
    dtIns   DATETIME ${dtNow},
    utente INT NOT NULL,
    bisogno INT NOT NULL,
    FOREIGN KEY (utente) REFERENCES utenti(idUs) ON DELETE NO ACTION,
    FOREIGN KEY (bisogno) REFERENCES bisogni(idBs) ON DELETE CASCADE
);`

router.post('/miPiaceB', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS miPiaceB'
    }

    try {
        if (resume) {
            await sequelize.query(resume, {
                type: sequelize.QueryTypes.DROP
            })
        }

        await sequelize.query(query)

        res.send('Table valBis creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post('/likeItem', async (req, res) => {
    const { itable, campo, id, utente } = req.body

    if (!itable || !campo || !id || !utente) {
        return res.status(400).json({ message: 'Missing required fields.' })
    }

    const campoName = (itable === 'B') ? 'bisogno' : 'proposta'

    try {
        // Insert the like into the database
        if (config.database.dbms == 'My SQL') {
            // MySQL query
            const sql = `INSERT INTO miPiace${itable} (dtIns, utente, ${campoName}) VALUES (now(), ?, ?)`
            await sequelize.query(sql, {
                replacements: [utente, id],
                type: sequelize.QueryTypes.INSERT
            })
        } else if (config.database.dbms == 'SQL Server') {
            // SQL Server query
            const sql = `INSERT INTO miPiace${itable} (utente, ${campoName}) VALUES (?, ?)`
            await sequelize.query(sql, {
                replacements: [utente, id],
                type: sequelize.QueryTypes.INSERT
            })
        }

        res.json({ message: 'Like added successfully.' })
    } catch (error) {
        console.error('Error inserting like:', error)
        res.status(500).json({ message: 'Error adding like.' })
    }
})

module.exports = router