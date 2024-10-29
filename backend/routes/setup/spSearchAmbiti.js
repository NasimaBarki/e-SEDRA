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
    query = `CREATE PROCEDURE srcAmbiti(idAm INT, Ambito VARCHAR(40), valenza INT)
    BEGIN
        IF idAm <> 0 THEN
            SELECT ambiti.idAm, ambiti.ambito, ambiti.valenza, ambiti.moreinfo
            FROM ambiti WHERE ambiti.idAm=idAm;
        ELSEIF valenza <> -1 THEN
            SELECT ambiti.idAm, ambiti.ambito, ambiti.valenza, ambiti.moreinfo
            FROM ambiti WHERE ambiti.valenza=valenza;
        ELSE
            SELECT ambiti.idAm, ambiti.ambito, ambiti.valenza, ambiti.moreinfo
            FROM ambiti WHERE ambiti.ambito=Ambito;
        END IF;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE srcAmbiti
        @idAm INT,
		@Ambito VARCHAR(40),
		@valenza INT
    AS
    BEGIN
        SET NOCOUNT ON;
        IF @idAm <> 0
            SELECT ambiti.idAm, ambiti.ambito, ambiti.valenza, ambiti.moreinfo
            FROM ambiti WHERE ambiti.idAm=@idAm;
        ELSE
            BEGIN
                IF @valenza <> -1
                        SELECT ambiti.idAm, ambiti.ambito, ambiti.valenza, ambiti.moreinfo
                        FROM ambiti WHERE ambiti.valenza=@valenza;
                ELSE
                        SELECT ambiti.idAm, ambiti.ambito, ambiti.valenza, ambiti.moreinfo
                        FROM ambiti WHERE ambiti.ambito=@Ambito;
            END
    END`

router.post('/spSearchAmbiti', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure srcAmbiti creata...')
})

module.exports = router