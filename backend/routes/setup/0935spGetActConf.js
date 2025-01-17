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
    query = `CREATE PROCEDURE getActConf(idAct INT)
    BEGIN
        SELECT attivita.dtStart, attivita.dtStop, attivita.altridati
        FROM attivita
        WHERE attivita.idAt=idAct;
	END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getActConf
        @idAct INT
    AS
    BEGIN
        SET NOCOUNT ON;
        SELECT attivita.dtStart, attivita.dtStop, attivita.altridati
        FROM attivita
        WHERE attivita.idAt=@idAct;
    END`

router.post('/spGetActConf', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getActConf creata...')
})

module.exports = router