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
    query = `CREATE PROCEDURE setLogLogin(idUsr INT, dtStart DATETIME, delLog INT)
    BEGIN
        IF delLog > 0 THEN
            DELETE FROM logs
            WHERE DATE_ADD(logs.dtstart, INTERVAL delLog MONTH) < NOW();
            INSERT INTO logs(logs.utente, logs.dtStart)
            VALUES(idUsr, dtStart);
        END IF;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE setLogLogin
        @idUsr INT,
		@dtStart DATETIME,
        @delLog INT
    AS
        BEGIN
            IF @delLog > 0 BEGIN
                DELETE FROM logs
                WHERE DATEADD(month, @delLog, logs.dtstart) < GETDATE();
                INSERT INTO logs(utente, dtStart)
		        VALUES(@idUsr, @dtStart);
            END
        END`

router.post('/spSetLogLogin', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure setLogLogin creata...')
})

module.exports = router