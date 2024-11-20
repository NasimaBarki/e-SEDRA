'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')
const { Int64BE } = require("int64-buffer")

// setup router
const router = express.Router()

// query
let query = ''

if (config.database.dbms == 'My SQL')
    query = `CREATE PROCEDURE getRuoliAll()
    BEGIN
		SELECT ruoli.idRl, ruoli.ruolo, ruoli.primario
		FROM ruoli
        WHERE ruoli.idRl > 1
		ORDER BY ruoli.primario DESC, ruoli.ruolo;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getRuoliAll
    AS
    BEGIN
        SET NOCOUNT ON;
		SELECT ruoli.idRl, ruoli.ruolo, ruoli.primario
		FROM ruoli
        WHERE ruoli.idRl > 1
		ORDER BY ruoli.primario DESC, ruoli.ruolo;
    END`

router.post('/spGetRuoliAll', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getRuoliAll creata...')
})

router.get('/getRuoliAll', async (req, res) => {
    let type = undefined
    try {
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
            //console.log(results)
            res.json(JSON.stringify(results))
        } else {
            res.json(null)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query getRuoliAll')
    }
})

module.exports = router