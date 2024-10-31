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
let bit = ''

let queryInsert = `INSERT INTO ruoli (primario, ruolo) VALUES
    (1,'Amministratore'),(1,'Studente'),
    (1,'Docente'),(1,'Personale ATA'),(1,'Genitore'),
    (1, 'DSGA'),
    (0,'Rappresentante di Classe'),
    (0,'Rappresentante di Istituto'),
    (0,'Membro della Consulta'),
    (0,'Membro del Comitato'),
    (0,'Partecipante Focus'),
    (0,'Commissione PTOF');`

if (config.database.dbms == 'My SQL') {
    autoinc = 'AUTO_INCREMENT'
    bit = '(1)'
}

else if (config.database.dbms == 'SQL Server') {
    autoinc = 'IDENTITY(1,1)'
}

let query = `CREATE TABLE ruoli (
    idRl  INT ` + autoinc + ` NOT NULL PRIMARY KEY,
    ruolo VARCHAR (30) NOT NULL,
    primario BIT` + bit + ` DEFAULT 0
);`

router.post('/ruoli', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS ruoli'
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

        res.send('Table ruoli creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router