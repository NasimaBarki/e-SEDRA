'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')
const formData = require('express-form-data') // ora dal client posso mandare form data

// setup router
const router = express.Router()

// query
let query = ''
let type = undefined

if (config.database.dbms == 'My SQL')
    query = `CREATE PROCEDURE getRolesActivities(idAt INT)
    BEGIN
        IF idAt <> 0 THEN
            SELECT t.activity, t.idR, t.idS, t.ruolo, ruoli.ruolo as subruolo
            FROM (SELECT attRuoli.activity, ruoli.ruolo, attRuoli.ruolo as idR, attRuoli.sottoruolo as idS
            FROM attRuoli, ruoli
            WHERE attRuoli.ruolo=ruoli.idRl ) AS t LEFT JOIN ruoli ON t.idS=ruoli.idRl
            WHERE  t.activity = idAt ORDER BY t.idR ASC, t.idS ASC;
        ELSE
            SELECT t.activity, t.idR, t.idS, t.ruolo, ruoli.ruolo as subruolo
            FROM (SELECT attRuoli.activity, ruoli.ruolo, attRuoli.ruolo as idR, attRuoli.sottoruolo as idS
            FROM attRuoli, ruoli
            WHERE attRuoli.ruolo=ruoli.idRl ) AS t LEFT JOIN ruoli ON t.idS=ruoli.idRl
            ORDER BY t.activity ASC, t.idR ASC, t.idS ASC;
        END IF;
    END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getRolesActivities
    @idAt INT
    AS
    BEGIN
        SET NOCOUNT ON;
        IF @idAt <> 0
            SELECT t.activity, t.idR, t.idS, t.ruolo, ruoli.ruolo as subruolo
            FROM (SELECT attRuoli.activity, ruoli.ruolo, attRuoli.ruolo as idR, attRuoli.sottoruolo as idS
            FROM attRuoli, ruoli
            WHERE attRuoli.ruolo=ruoli.idRl ) AS t LEFT JOIN ruoli ON t.idS=ruoli.idRl
            WHERE  t.activity = @idAt ORDER BY t.idR ASC, t.idS ASC;
        ELSE
            SELECT t.activity, t.idR, t.idS, t.ruolo, ruoli.ruolo as subruolo
            FROM (SELECT attRuoli.activity, ruoli.ruolo, attRuoli.ruolo as idR, attRuoli.sottoruolo as idS
            FROM attRuoli, ruoli
            WHERE attRuoli.ruolo=ruoli.idRl ) AS t LEFT JOIN ruoli ON t.idS=ruoli.idRl
            ORDER BY t.activity ASC, t.idR ASC, t.idS ASC;
    END`

router.post('/spGetRolesActivity', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getRolesActivity creata...')
})

router.post('/getRoleActivity', async (req, res) => {
    if (config.database.dbms == 'SQL Server') {
        query = 'CALL getRolesActivities(:ida)'

        type = false
    }
    else if (config.database.dbms == 'My SQL') {
        query = 'CALL getRolesActivities(:ida)'

        type = true
    }

    try {
        const [results, metadata] = await sequelize.query(query, {
            ...type && { replacements: { ida: req.body.idAt } },
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        if (results.length != 0)
            res.json(results)
        else
            res.json(0)
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query getRolesActivity')
    }
})

module.exports = router