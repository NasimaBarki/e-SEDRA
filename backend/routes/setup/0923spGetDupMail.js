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
    query = `CREATE PROCEDURE getDupMail(testo varchar(30))
    BEGIN
        SELECT utenti.email
        FROM utenti
        WHERE utenti.email LIKE testo;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getDupMail
        @testo VARCHAR(30)
    AS
        BEGIN
            SET NOCOUNT ON;
            SELECT utenti.email
            FROM utenti
            WHERE utenti.email LIKE @testo;
        END`

router.post('/spGetDupMail', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getDupMail creata...')
})

module.exports = router