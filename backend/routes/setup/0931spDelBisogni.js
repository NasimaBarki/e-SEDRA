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
    query = `CREATE PROCEDURE delBisogni(vid INT, logic INT)
    BEGIN
         IF logic = 1 THEN
              UPDATE bisogni SET deleted=logic, pubblicato=0 WHERE idBs=vid;
        ELSE
              DELETE FROM bisogni WHERE idBs=vid;
        END IF;
    END;`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE delBisogni
        @vid INT,
        @logic INT
    AS
        BEGIN
                SET NOCOUNT ON;
                IF @logic = 1 BEGIN
                    UPDATE bisogni SET deleted=@logic, pubblicato=0 WHERE idBs=@vid;
                END
                ELSE BEGIN
                    DELETE FROM bisogni WHERE idBs=@vid;
                END
        END`

router.post('/spDelBisogni', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure delBisogni creata...')
})

module.exports = router