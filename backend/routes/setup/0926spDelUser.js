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
    query = `CREATE PROCEDURE delDataUser(id INT)
    BEGIN
            DELETE FROM utenti
		        WHERE idUs=id;
    END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE delDataUser
        @id INT
    AS
        BEGIN
                SET NOCOUNT ON;
                DELETE FROM utenti
		        WHERE idUs=@id;
        END`

router.post('/spDelUser', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure delUser creata...')
})

module.exports = router