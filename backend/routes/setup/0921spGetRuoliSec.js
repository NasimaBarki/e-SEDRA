'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')

// setup router
const router = express.Router()

// query
let query = ''
let type = undefined

if (config.database.dbms == 'My SQL')
    query = `CREATE PROCEDURE getRuoliSec(idRp INT)
    BEGIN
        SELECT sub.idRl AS idS, sub.ruolo AS S
        FROM ruoli LEFT JOIN
                (subRuoli INNER JOIN ruoli AS sub on subRuoli.subRuolo = sub.idRl)
             on ruoli.idRl=subRuoli.ruolo
        WHERE ruoli.primario=1 AND ruoli.idRl=idRp
        ORDER BY sub.ruolo ASC;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getRuoliSec
          @idRp INT
    AS
    BEGIN
        SET NOCOUNT ON;
        SELECT sub.idRl AS idS, sub.ruolo AS S
        FROM ruoli LEFT JOIN
                (subRuoli INNER JOIN ruoli AS sub on subRuoli.subRuolo = sub.idRl)
             on ruoli.idRl=subRuoli.ruolo
        WHERE ruoli.primario=1 AND ruoli.idRl=@idRp
        ORDER BY sub.ruolo ASC;
    END`

router.post('/spGetRuoliSec', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getRuoliSec creata...')
})

router.post('/getRuoliSec', async (req, res) => {
    let ruoloPrimario = JSON.parse(req.body.data)

    try {
        if (config.database.dbms == 'SQL Server') {
            query = 'EXEC getRuoliSec @idRp="' + ruoloPrimario['idRl'] + '"'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL getRuoliSec(:idRp)'

            type = true
        }

        const [results, metadata] = await sequelize.query(query, {
            ...type && { replacements: { idRp: ruoloPrimario['idRl'] } },
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        if (results) {
            res.json(results)
        } else {
            res.json(null)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query getRuoliSec')
    }
})

module.exports = router