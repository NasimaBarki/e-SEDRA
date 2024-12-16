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
    query = `CREATE PROCEDURE updRuoli(idRl INT, idRs INT, Ruolo VARCHAR(30))
    BEGIN
        IF idRl = 1 THEN
            INSERT INTO ruoli(ruolo, primario) VALUES(Ruolo, 1);
        ELSEIF idRs = 1 THEN
            INSERT INTO ruoli(ruolo, primario) VALUES(Ruolo, 0);
			SET @ID:= LAST_INSERT_ID();
            INSERT INTO subRuoli(ruolo, subRuolo) VALUES(idRl, @ID);
        ELSEIF idRl > 1 AND idRs > 1 THEN
            INSERT INTO subRuoli(ruolo, subRuolo) VALUES(idRl, idRs);
		ELSEIF Ruolo = '' THEN
            DELETE FROM subRuoli WHERE subRuoli.ruolo = idRl OR subRuoli.subRuolo = idRl;
            DELETE FROM ruoli WHERE ruoli.idRl = idRl OR
                   ruoli.idRl NOT IN (SELECT subRuoli.subRuolo FROM subRuoli)
                   AND ruoli.primario = 0;
        END IF;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE updRuoli
        @idRl INT,
        @idRs INT,
		@Ruolo VARCHAR(30)
    AS
    BEGIN
        SET NOCOUNT ON;
        DECLARE @ID INT;
        IF @idRl = 1 BEGIN
            INSERT INTO ruoli(ruolo, primario) VALUES(@Ruolo, 1);
        END
        ELSE IF @idRs = 1 BEGIN
            INSERT INTO ruoli(ruolo, primario) VALUES(@Ruolo, 0);
			SET @ID = @@IDENTITY;
            INSERT INTO subRuoli(ruolo, subRuolo) VALUES(@idRl, @ID);
        END
        ELSE IF @idRl > 1 AND @idRs > 1 BEGIN
            INSERT INTO subRuoli(ruolo, subRuolo) VALUES(@idRl, @idRs);
        END
		ELSE IF @Ruolo = '' BEGIN
            DELETE FROM subRuoli WHERE subRuoli.ruolo = @idRl OR subRuoli.subRuolo = @idRl;
            DELETE FROM ruoli WHERE ruoli.idRl = @idRl OR
                   ruoli.idRl NOT IN (SELECT subRuoli.subRuolo FROM subRuoli)
                   AND ruoli.primario = 0;
        END
    END`

router.post('/spUpdRuoli', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure updRuoli creata...')
})

module.exports = router