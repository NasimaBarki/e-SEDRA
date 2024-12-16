'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')

// setup router
const router = express.Router()

const bodyParser = require('body-parser')
router.use(bodyParser.json()); // support json encoded bodies
router.use(express.urlencoded({ extended: true })); // support encoded bodies

let type = undefined

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

router.post('/updruoli', async (req, res) => {
    req.headers['content-type'] = 'application/x-www-form-urlencoded'
    let body = req.body

    console.log('BODY: ', body)

    try {
        if (config.database.dbms == 'SQL Server') {
            query = 'updRuoli @idRl=\'' + body.idRl + '\', @idRs=\'' + body.idRs +
                '\', @ruolo=\'' + body.val + '\';'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL updRuoli(:idRl, :idRs, :ruolo)'

            type = true
        }

        await sequelize.query(query, {
            ...type && { replacements: { idRl: body.idRl, idRs: body.idRs, ruolo: body.val } }
        })

        // getRuoliAll
        if (config.database.dbms == 'SQL Server') {
            query = 'EXEC getRuoliAll'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL getRuoliAll'

            type = true
        }

        const [results, metadata] = await sequelize.query(query, {
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        if (results) {
            if (config.database.dbms == 'My SQL') {
                for (const row of Object.entries(results)) {
                    let num = JSON.stringify(row[1].primario).slice(-3, JSON.stringify(row[1].primario).length - 2)
                    row[1].primario = parseInt(num)
                }
            }
            console.log(results)
            res.set('Content-Type', 'application/json')
            res.json(results)
        } else {
            console.log('Niente ruoli')
            res.json(null)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query updRuoli')
    }
})

module.exports = router