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
    query = `CREATE PROCEDURE reqToken(email VARCHAR(30), token VARCHAR(10), exp INT)
    BEGIN
		SELECT @num := COUNT(*), @idUs := MAX(utenti.idUs)
        FROM utenti
        WHERE utenti.email = email;
        DELETE FROM token WHERE token.dtExp < NOW() OR token.utente=@idUs;
        IF @num > 0 THEN
            IF exp = 0 THEN SET exp = NULL; END IF;
            INSERT INTO token(token.utente, token.token, token.dtExp)
            VALUES (@idUs, token, DATE_ADD(NOW(), INTERVAL exp HOUR));
        END IF;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE reqToken
        @email VARCHAR(30),
		@token VARCHAR(10),
		@exp INT
    AS
    BEGIN
        SET NOCOUNT ON;
		DECLARE @idUs INT;
		DECLARE @num INT;
		SELECT @num=COUNT(*), @idUs=utenti.idUs FROM utenti
		WHERE utenti.email=@email GROUP BY utenti.idUs;
        DELETE FROM token WHERE token.dtExp < GETDATE() OR token.utente = @idUs;
        IF @num > 0 BEGIN
			IF @exp = 0 BEGIN SET @exp = NULL; END
			INSERT INTO token(utente, token, dtExp)
			VALUES (@idUs, @token, DATEADD(hour, @exp, GETDATE()));
		END
		SELECT @num;
    END`

router.post('/spReqToken', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    console.log('Login')
    res.send('Stored procedure reqToken creata...')
})

module.exports = router