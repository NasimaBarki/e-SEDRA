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
    query = `CREATE PROCEDURE revBisogni(vid INT, topicid INT, more VARCHAR(30), title VARCHAR(60), body VARCHAR(1024),image VARCHAR(50),publish TINYINT,revisor INT, note VARCHAR(60),crud CHAR(1))
    BEGIN
        IF crud = 'D' THEN
            UPDATE bisogni SET deleted=1, revisore=revisor, pubblicato=0 WHERE idBs=vid;
        ELSE IF crud = 'R' THEN
            UPDATE bisogni SET ambito=topicid, moreambito=more, titleBis=title, textBis=body, imgBis=image, dtRev=now(), pubblicato=publish, rev=note, revisore=revisor
            WHERE idBs=vid;
        END IF;
       END IF;
    END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE revBisogni
        @vid INT,
        @topicid INT,
        @more VARCHAR(30),
        @title VARCHAR(60),
        @body VARCHAR(1024),
        @image VARCHAR(50),
        @publish TINYINT,
        @revisor INT,
        @note VARCHAR(60),
        @crud CHAR(1)
    AS
        BEGIN
                SET NOCOUNT ON;
                IF @crud = 'D' BEGIN
                    UPDATE bisogni SET deleted=1, revisore=@revisor, pubblicato=0 WHERE idBs=@vid;
                END
                ELSE IF @crud = 'R' BEGIN
                    UPDATE bisogni SET ambito=@topicid, moreambito=@more, titleBis=@title, textBis=@body, imgBis=@image, dtRev=getdate(), pubblicato=@publish, rev=@note, revisore=@revisor
		            WHERE idBs=@vid;
                END
        END`

router.post('/spRevBisogni', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure revBisogni creata...')
})

module.exports = router