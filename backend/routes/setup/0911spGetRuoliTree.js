'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')

// setup router
const router = express.Router()

// query
let type = undefined
let query = ''

if (config.database.dbms == 'My SQL')
    query = `CREATE PROCEDURE getRuoliTree()
    BEGIN
        SELECT ruoli.idRl AS idR, ruoli.ruolo AS R, sub.idRl AS idS, sub.ruolo AS S
        FROM ruoli LEFT JOIN
                (subRuoli INNER JOIN ruoli AS sub on subRuoli.subRuolo = sub.idRl)
             on ruoli.idRl=subRuoli.ruolo
        WHERE ruoli.idRl > 1 AND ruoli.primario=1
        ORDER BY ruoli.ruolo, sub.ruolo;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getRuoliTree
    AS
    BEGIN
        SET NOCOUNT ON;
        SELECT ruoli.idRl AS idR, ruoli.ruolo AS R, sub.idRl AS idS, sub.ruolo AS S
        FROM ruoli LEFT JOIN
                (subRuoli INNER JOIN ruoli AS sub on subRuoli.subRuolo = sub.idRl)
             on ruoli.idRl=subRuoli.ruolo
        WHERE ruoli.idRl > 1 AND ruoli.primario=1
        ORDER BY ruoli.ruolo, sub.ruolo;
    END`

router.post('/spGetRuoliTree', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getRuoliTree creata...')
})

router.get('/getRuoliTree', async (req, res) => {
    try {
        if (config.database.dbms == 'SQL Server') {
            query = 'EXEC getRuoliTree'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL getRuoliTree'

            type = true
        }

        const [results, metadata] = await sequelize.query(query, {
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        if (results) {
            //console.log(results)
            res.json(JSON.stringify(results))
        } else {
            res.json(null)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query getRuoliTree')
    }
})

module.exports = router