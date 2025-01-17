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
    query = `CREATE PROCEDURE getNroVoti(idAct INT, idUs INT)
    BEGIN
        IF idAct = 104 THEN
            SELECT valBis.grade, COUNT(valBis.grade) AS tot
            FROM valBis
            WHERE valBis.utente=idUs AND valBis.dtIns>=(SELECT dtStart FROM attivita where idAt=idAct) AND valBis.dtIns<=(SELECT dtStop FROM attivita where idAt=idAct)
            GROUP BY valBis.grade;
        ELSE
            SELECT valPrp.grade, COUNT(valPrp.grade) AS tot
            FROM valPrp
            WHERE valPrp.utente=idUs AND valPrp.dtIns>=(SELECT dtStart FROM attivita where idAt=idAct) AND valPrp.dtIns<=(SELECT dtStop FROM attivita where idAt=idAct)
            GROUP BY valPrp.grade;
        END IF;
	END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getNroVoti
        @idAct INT,
        @idUs INT
    AS
    BEGIN
        IF @idAct = 104
        BEGIN
            SELECT valBis.grade, COUNT(valBis.grade) AS tot
            FROM valBis
            WHERE valBis.utente=@idUs AND valBis.dtIns>=(SELECT dtStart FROM attivita where idAt=@idAct) AND valBis.dtIns<=(SELECT dtStop FROM attivita where idAt=@idAct)
            GROUP BY valBis.grade;
        END
        ELSE BEGIN
            SELECT valPrp.grade, COUNT(valPrp.grade) AS tot
            FROM valPrp
            WHERE valPrp.utente=@idUs AND valPrp.dtIns>=(SELECT dtStart FROM attivita where idAt=@idAct) AND valPrp.dtIns<=(SELECT dtStop FROM attivita where idAt=@idAct)
            GROUP BY valPrp.grade;
        END
    END`

router.post('/spGetNrVoti', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure GetNroVoti creata...')
})

module.exports = router