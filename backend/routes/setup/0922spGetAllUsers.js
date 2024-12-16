'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')
const roles = require('../../js/utilfunctions')

// setup router
const router = express.Router()

// query
let query = ''
let type = undefined

if (config.database.dbms == 'My SQL')
    query = `CREATE PROCEDURE getAllUsers(testo varchar(30))
    BEGIN
        select t.email, t.idUs, t.nome, t.cognome,  t.ruolo, ruoli.ruolo as subruolo
        from (SELECT utenti.idUs, utenti.nome, utenti.cognome, utenti.email, ruoli.ruolo, ruoliUtenti.subruolo as subruolo
        FROM utenti left JOIN (
            ruoliUtenti inner join ruoli on ruoliUtenti.ruolo=ruoli.idRl )  ON utenti.idUs=ruoliUtenti.utente) as t left join  ruoli on t.subruolo=ruoli.idRl
        WHERE t.cognome LIKE testo
        ORDER BY t.cognome ASC, t.nome ASC, t.email ASC, t.ruolo ASC, subruolo ASC;
    END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getAllUsers
        @testo VARCHAR(30)
    AS
    BEGIN
        SET NOCOUNT ON;
        select t.email, t.idUs, t.nome, t.cognome, t.ruolo, ruoli.ruolo as subruolo
        from (SELECT utenti.idUs, utenti.nome, utenti.cognome, utenti.email, ruoli.ruolo, ruoliUtenti.subruolo as subruolo
        FROM utenti left JOIN (
            ruoliUtenti inner join ruoli on ruoliUtenti.ruolo=ruoli.idRl )  ON utenti.idUs=ruoliUtenti.utente) as t left join  ruoli on t.subruolo=ruoli.idRl
        WHERE t.cognome LIKE @testo
        ORDER BY t.cognome ASC, t.nome ASC, t.email ASC, t.ruolo ASC, subruolo ASC;
    END`

router.post('/spGetAllUsers', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getAllUsers creata...')
})

router.post('/getusers', async (req, res) => {
    let search = req.body.search

    try {
        if (config.database.dbms == 'SQL Server') {
            query = 'EXEC getAllUsers @how="' + search + '"'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL getAllUsers(:how)'

            type = true
        }

        const [results, metadata] = await sequelize.query(query, {
            ...type && { replacements: { how: search } },
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        if (results) {
            res.json(roles.rolesToString(results, 'idUs'))
        } else {
            res.json(null)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query getAllUsers')
    }
})

module.exports = router