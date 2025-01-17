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
    query = `CREATE PROCEDURE getSingleBisogno(idBs INT, pub INT)
    BEGIN
        IF pub=1 THEN
            SELECT *
            FROM bisogni WHERE bisogni.idBs=idBs AND bisogni.pubblicato=1;
        ELSE
            SELECT *
            FROM bisogni WHERE bisogni.idBs=idBs;
        END IF;
    END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getSingleBisogno
        @idBs INT,
		@pub INT
    AS
    BEGIN
        SET NOCOUNT ON;
        IF @pub = 1
            SELECT *
            FROM bisogni WHERE bisogni.idBs=@idBs AND bisogni.pubblicato=1;
        ELSE
            SELECT *
            FROM bisogni WHERE bisogni.idBs=@idBs;
    END`

router.post('/spGetSingleBisogno', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getSingleBisogno creata...')
})

module.exports = router