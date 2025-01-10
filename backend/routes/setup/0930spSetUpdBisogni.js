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
    query = `CREATE PROCEDURE setBisogni(vid INT, topicid INT, more VARCHAR(30), title VARCHAR(60),image VARCHAR(50),body VARCHAR(1024),publish TINYINT,utente INT, crud CHAR(1))
    BEGIN
         IF crud = 'C' THEN
            INSERT INTO bisogni (utente, ambito, moreambito, titleBis,  imgBis, textBis, pubblicato, dtIns, aggiornato)
                    VALUES(utente, topicid, more, title,image, body, publish, now(), now());
        ELSE IF crud = 'U' THEN
            UPDATE bisogni SET titleBis=title, ambito= topicid, moreambito=more, imgBis=image, textBis=body, aggiornato=now()
            WHERE idBs=vid;
        END IF;
       END IF;
    END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE setBisogni
        @vid INT,
        @topicid INT,
        @more VARCHAR(30),
        @title VARCHAR(60),
		@image VARCHAR(50),
        @body VARCHAR(1024),
        @publish TINYINT,
        @utente INT,
        @crud char(1)
    AS
        BEGIN
                SET NOCOUNT ON;
                IF @crud = 'C' BEGIN
                    INSERT INTO bisogni (utente, ambito, moreambito, titleBis,  imgBis, textBis, pubblicato, dtIns, aggiornato)
                    VALUES(@utente, @topicid, @more, @title,@image, @body, @publish, getdate(), getdate());
                END
                ELSE IF @crud = 'U' BEGIN
                    UPDATE bisogni SET titleBis=@title, ambito=@topicid, moreambito=@more, imgBis=@image, textBis=@body, aggiornato=getdate()
		            WHERE idBs=@vid;
                END
        END`

router.post('/spSetUpdBisogni', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure setBisogni creata...')
})

module.exports = router