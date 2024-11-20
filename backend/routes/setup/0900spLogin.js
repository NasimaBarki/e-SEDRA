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
    query = `CREATE PROCEDURE Login(email VARCHAR(30), scPsw INT)
    BEGIN
        SET @dtStart = NOW();

        IF scPsw > 0 THEN
			SELECT @num:=COUNT(*) AS X, utenti.idUs, @dtStart AS dtStart,
			DATEDIFF(DATE_ADD(utenti.dtPsw, INTERVAL scPsw MONTH), @dtStart) AS ggScPsw,
			utenti.email, utenti.psw
			FROM utenti WHERE utenti.email=email
            GROUP BY utenti.idUs;
		ELSE
 			SELECT @num:=COUNT(*) AS X, utenti.idUs, @dtStart AS dtStart,
			utenti.email, utenti.psw
			FROM utenti WHERE utenti.email=email
            GROUP BY utenti.idUs;
        END IF;

		IF @num > 0 THEN
	        CREATE OR REPLACE view t as SELECT utenti.idUs, utenti.nome, utenti.cognome, utenti.email, utenti.cell, utenti.cod, utenti.menuAct, utenti.psw, utenti.dtPsw, ruoli.ruolo, ruoliUtenti.ruolo as ruoloNU, ruoliUtenti.subruolo as subruoloNU
        FROM utenti left JOIN ( ruoliUtenti INNER JOIN ruoli on ruoliUtenti.ruolo=ruoli.idRl )  ON utenti.idUs=ruoliUtenti.utente;
        SELECT t.email, t.idUs, t.nome, t.cognome, t.cell, t.cod, t.menuAct, t.psw, t.dtPsw, t.ruolo, t.ruoloNU, ruoli.ruolo as subruolo, t.subruoloNU
            FROM (t left JOIN  ruoli on t.subruoloNU=ruoli.idRl)
            WHERE t.email=email
            ORDER BY t.ruolo ASC, subruolo ASC;
        END IF;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE Login
        @email VARCHAR(30),
		@scPsw INT
    AS
    BEGIN
        SET NOCOUNT ON;
        DECLARE @dtStart DATETIME;
		SET @dtStart = GETDATE();

		IF @scPsw > 0
		BEGIN
			SELECT utenti.idUs, @dtStart AS dtStart, DATEDIFF(day, @dtStart, DATEADD(month, @scPsw, utenti.dtPsw)) AS ggScPsw,
			utenti.email, utenti.psw
			FROM utenti WHERE utenti.email=@email;
        END
		ELSE
		BEGIN
			SELECT utenti.idUs, @dtStart AS dtStart,
			utenti.email, utenti.psw
			FROM utenti WHERE utenti.email=@email;
		END

		IF @@Rowcount > 0 BEGIN
			select t.email, t.idUs, t.nome, t.cognome, t.cell, t.cod, t.menuAct, t.psw, t.dtPsw, t.ruolo, t.ruoloNU, ruoli.ruolo as subruolo, t.subruoloNU
            FROM (SELECT utenti.idUs, utenti.nome, utenti.cognome, utenti.email, utenti.cell, utenti.cod, utenti.menuAct, utenti.psw, utenti.dtPsw, ruoli.ruolo, ruoliutenti.ruolo as ruoloNU, ruoliutenti.subruolo as subruoloNU
            FROM UTENTI left JOIN (
                RUOLIUTENTI inner join ruoli on ruoliutenti.ruolo=ruoli.idRl )  ON utenti.idUs=ruoliutenti.utente) as t left join  ruoli on t.subruoloNU=ruoli.idRl
            WHERE t.email = @email
            ORDER BY t.ruolo ASC, subruolo ASC;
		END
    END`

router.post('/spLogin', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    console.log('Login')
    res.send('Stored procedure Login creata...')
})

module.exports = router