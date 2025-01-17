'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')

// setup router
const router = express.Router()

// query
let query = ''
let type = undefined

if (config.database.dbms == 'My SQL')
    query = `CREATE PROCEDURE updValBis(
    IN idBis INT,
    IN idUs INT,
    IN val INT
)
BEGIN
    DECLARE id INT DEFAULT 0;

    SELECT valBis.idVb INTO id FROM valBis
    WHERE valBis.bisogno = idBis AND valBis.utente = idUs
    AND valBis.dtIns >= (SELECT dtStart FROM attivita WHERE idAt = 104)
    AND valBis.dtIns <= (SELECT dtStop FROM attivita WHERE idAt = 104)
    LIMIT 1;

    IF id > 0 THEN
        UPDATE valBis SET grade = val, dtIns = NOW() WHERE idVb = id;
    ELSE
        INSERT INTO valBis(bisogno, utente, grade, dtIns) VALUES(idBis, idUs, val,now());
    END IF;
END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE updValBis
        @idBis INT,
        @idUs INT,
		@val INT
    AS
    BEGIN
        SET NOCOUNT ON;
        DECLARE @id INT;

		SELECT @id=valBis.idVb FROM valBis WHERE valBis.bisogno=@idBis AND valBis.utente=@idUs AND valBis.dtIns >= (SELECT dtStart FROM attivita WHERE idAt=104) AND valBis.dtIns <= (SELECT dtStop FROM attivita WHERE idAt=104);
		IF @id > 0 BEGIN
			 UPDATE valBis SET valBis.grade=@val, valBis.dtIns=getdate() WHERE valBis.idVb=@id;
		END
		ELSE BEGIN
			INSERT INTO valBis(bisogno, utente, grade) VALUES(@idBis, @idUs, @val);
		END
    END`

router.post('/spUpdValBis', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure updValBis creata...')
})

module.exports = router