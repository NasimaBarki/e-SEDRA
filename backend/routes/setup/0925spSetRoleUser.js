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
    query = `CREATE PROCEDURE setRoleUser(ut INT, role INT, sub INT)
    BEGIN
            IF sub = 0 THEN
                INSERT INTO ruoliUtenti(utente, ruolo)
		                    VALUES(ut, role);
            ELSE
                INSERT INTO ruoliUtenti(utente, ruolo, subruolo)
		                    VALUES(ut, role, sub);
            END IF;
    END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE setRoleUser
        @ut INT,
		@role INT,
        @sub INT
    AS
        BEGIN
            SET NOCOUNT ON;
            IF @sub = 0
                BEGIN
                    INSERT INTO ruoliUtenti(utente, ruolo)
		            VALUES(@ut, @role);
                END
            ELSE
                BEGIN
                    INSERT INTO ruoliUtenti(utente, ruolo,subruolo)
		            VALUES(@ut, @role,@sub);
                END
        END`

router.post('/spSetRoleUser', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure spSetRoleUser creata...')
})

module.exports = router