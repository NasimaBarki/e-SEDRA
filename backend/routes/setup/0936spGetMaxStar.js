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
    query = `CREATE PROCEDURE getMaxStar(tipo INT)
    BEGIN
        IF tipo = 104 THEN
            SELECT numberOfStars.idStar, numberOfStars.vbis AS maxStar
            FROM numberOfStars;
        ELSE
            SELECT numberOfStars.idStar, numberOfStars.vpro AS maxStar
            FROM numberOfStars;
        END IF;
	END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getMaxStar
        @tipo INT
    AS
    BEGIN
        IF @tipo = 104
        BEGIN
            SELECT numberOfStars.idStar, numberOfStars.vbis AS maxStar
            FROM numberOfStars;
        END
        ELSE BEGIN
            SELECT numberOfStars.idStar, numberOfStars.vpro AS maxstar
            FROM numberOfStars;
        END
    END`

router.post('/spGetMaxStar', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure GetMaxStar creata...')
})

module.exports = router