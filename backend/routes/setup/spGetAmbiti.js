'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')

// setup router
const router = express.Router()

// query
let query = ''

if (config.database.dbms == 'My SQL')
    query = `CREATE PROCEDURE getAmbiti()
            BEGIN
                SELECT ambiti.idAm, ambiti.ambito, ambiti.valenza, ambiti.moreinfo
                FROM ambiti ORDER BY ambiti.valenza DESC, ambiti.ambito;
            END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getAmbiti
            AS
            BEGIN
            SET NOCOUNT ON;
            SELECT ambiti.idAm, ambiti.ambito, ambiti.valenza, ambiti.moreinfo
            FROM ambiti ORDER BY ambiti.valenza DESC, ambiti.ambito;
        END`

router.post('/spGetAmbiti', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getAmbiti creata...')
})

module.exports = router