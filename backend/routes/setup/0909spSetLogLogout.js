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
    query = `CREATE PROCEDURE setLogLogout(idUsr INT, dtStart DATETIME)
    BEGIN
        UPDATE logs SET dtEnd=NOW()
        WHERE logs.utente=idUsr AND logs.dtStart=dtStart;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE setLogLogout
        @idUsr INT,
		@dtStart DATETIME
    AS
        BEGIN
            UPDATE logs SET dtEnd=GETDATE()
            WHERE logs.utente=@idUsr AND logs.dtStart=@dtStart;
        END`

router.post('/spSetLogLogout', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure setLogLogout creata...')
})

module.exports = router