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
    query = `CREATE PROCEDURE delRolesUser(id INT)
    BEGIN
            DELETE FROM ruoliUtenti
		        WHERE utente=id AND ruolo <> 1;
    END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE delRolesUser
        @id INT
    AS
        BEGIN
                SET NOCOUNT ON;
                DELETE FROM ruoliUtenti
		        WHERE utente=@id AND ruolo <> 1;
        END`

router.post('/spDelRolesUser', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure delRolesUser creata...')
})

module.exports = router