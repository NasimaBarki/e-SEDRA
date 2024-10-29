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
    query = `CREATE PROCEDURE updAmbiti(crud CHAR(1), idAm INT, amb VARCHAR(40), vale INT, ck TINYINT)
    BEGIN
        IF crud='C' THEN
            INSERT INTO ambiti(ambito, valenza, moreinfo) VALUES(amb, vale, ck);
        ELSEIF crud='D' THEN
            DELETE FROM ambiti WHERE ambiti.idAm = idAm;
        ELSEIF crud='U' THEN
            UPDATE ambiti SET ambito=amb, valenza=vale, moreinfo=ck WHERE ambiti.idAm=idAm;
        END IF;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE updAmbiti
        @crud char(1),
        @idAm INT,
		@Ambito VARCHAR(40),
		@valenza INT,
        @ck TINYINT
    AS
    BEGIN
        SET NOCOUNT ON;
        IF @crud='C'
            INSERT INTO ambiti(ambito, valenza, moreinfo) VALUES(@Ambito, @valenza,@ck);
        ELSE IF @crud ='D'
            DELETE FROM ambiti WHERE ambiti.idAm = @idAm;
        ELSE IF @crud='U'
            UPDATE ambiti SET ambito=@Ambito, valenza=@valenza, moreinfo=@ck WHERE idAm=@idAm;
    END`

router.post('/spUpdateAmbiti', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure updAmbiti creata...')
})

module.exports = router