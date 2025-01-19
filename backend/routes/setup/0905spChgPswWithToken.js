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
    query = `CREATE PROCEDURE chgPswWithToken(token VARCHAR(10), newPsw VARCHAR(255))
	BEGIN
		SELECT @num := COUNT(*), @idUs := token.utente
    FROM token
    WHERE token.token = token AND (token.dtExp IS NULL OR token.dtExp > NOW())
    GROUP BY token.utente;  -- Add GROUP BY for token.utente

    IF @num > 0 THEN
        UPDATE utenti
        SET utenti.psw = newPsw, utenti.dtPsw = NOW()
        WHERE utenti.idUs = @idUs;
    END IF;

    DELETE FROM token WHERE token.token = token;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE chgPswWithToken
        @token VARCHAR(10),
		@newPsw VARCHAR(255)
    AS
    BEGIN
        SET NOCOUNT ON;
		DECLARE @idUs INT;
		DECLARE @num INT;
		SELECT @num=COUNT(*), @idUs=token.utente FROM token
        WHERE token.token=@token AND
			  (token.dtExp IS NULL OR token.dtExp > GETDATE())
		GROUP BY token.utente;
	    IF @num > 0
		BEGIN
		    UPDATE utenti SET utenti.psw=@newPsw, utenti.dtPsw=GETDATE()
		    WHERE utenti.idUs=@idUs;
		END
		DELETE FROM token WHERE token.token=@token;
		SELECT @num;
    END`

router.post('/spChgPswWithToken', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure chgPswWithToken creata...')
})

module.exports = router