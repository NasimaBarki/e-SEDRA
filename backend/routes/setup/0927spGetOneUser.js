'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')
const roles = require('../../js/utilfunctions')

// setup router
const router = express.Router()

// query
let query = ''
let type = undefined

if (config.database.dbms == 'My SQL')
    query = `CREATE PROCEDURE getOneUser(idU int, pw int)
    BEGIN
        CREATE OR REPLACE view t as SELECT utenti.idUs, utenti.nome, utenti.cognome, utenti.email, utenti.cell, utenti.cod, utenti.psw, utenti.dtPsw, ruoli.ruolo, ruoliUtenti.ruolo as ruoloNU, ruoliUtenti.subruolo as subruoloNU
        FROM utenti left JOIN ( ruoliUtenti INNER JOIN ruoli on ruoliUtenti.ruolo=ruoli.idRl )  ON utenti.idUs=ruoliUtenti.utente;
        IF pw=0 THEN
            SELECT t.email, t.idUs, t.nome, t.cognome, t.cell, t.cod, t.ruolo, t.ruoloNU, ruoli.ruolo as subruolo, t.subruoloNU
            FROM (t left JOIN  ruoli on t.subruoloNU=ruoli.idRl)
            WHERE t.idUs=idU
            ORDER BY t.ruolo ASC, subruolo ASC;
        ELSE
            SELECT t.email, t.idUs, t.nome, t.cognome, t.cell, t.cod, t.psw, t.dtPsw, t.ruolo, t.ruoloNU, ruoli.ruolo as subruolo, t.subruoloNU
            FROM (t left JOIN  ruoli on t.subruoloNU=ruoli.idRl)
            WHERE t.idUs=idU
            ORDER BY t.ruolo ASC, subruolo ASC;
        END IF;
    END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getOneUser
        @idU INT,
        @pw INT
    AS
    BEGIN
       SET NOCOUNT ON;
        IF @pw = 0 BEGIN
                select t.email, t.idUs, t.nome, t.cognome, t.cell, t.cod, t.ruolo, t.ruoloNU, ruoli.ruolo as subruolo, t.subruoloNU
                from (SELECT utenti.idUs, utenti.nome, utenti.cognome, utenti.email, utenti.cell, utenti.cod, ruoli.ruolo, ruoliutenti.ruolo as ruoloNU, ruoliutenti.subruolo as subruoloNU
                FROM UTENTI left JOIN (
                    RUOLIUTENTI inner join ruoli on ruoliutenti.ruolo=ruoli.idRl )  ON utenti.idUs=ruoliutenti.utente) as t left join  ruoli on t.subruoloNU=ruoli.idRl
                WHERE t.idUs = @idU
                ORDER BY t.ruolo ASC, subruolo ASC;
            END
        ELSE BEGIN
                select t.email, t.idUs, t.nome, t.cognome, t.cell, t.cod, t.psw, t.dtPsw, t.ruolo, t.ruoloNU, ruoli.ruolo as subruolo, t.subruoloNU
                from (SELECT utenti.idUs, utenti.nome, utenti.cognome, utenti.email, utenti.cell, utenti.cod, utenti.psw, utenti.dtPsw, ruoli.ruolo, ruoliutenti.ruolo as ruoloNU, ruoliutenti.subruolo as subruoloNU
                FROM UTENTI left JOIN (
                    RUOLIUTENTI inner join ruoli on ruoliutenti.ruolo=ruoli.idRl )  ON utenti.idUs=ruoliutenti.utente) as t left join  ruoli on t.subruoloNU=ruoli.idRl
                WHERE t.idUs = @idU
                ORDER BY t.ruolo ASC, subruolo ASC;
            END
    END`

router.post('/spGetOneUser', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getOneUser creata...')
})

router.post('/edituser', async (req, res) => {
    let user = req.body

    try {
        if (config.database.dbms == 'SQL Server') {
            query = 'EXEC getOneUser @how="' + user.user_id + '", @pw="' + user.pw + '"'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL getOneUser(:how, :pw)'

            type = true
        }

        const [results, metadata] = await sequelize.query(query, {
            ...type && { replacements: { how: user.user_id, pw: user.pw } },
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        if (results) {
            let rows = []

            for (const [key, value] of Object.entries(results)) {
                rows.push(value)
            }

            let user = roles.rolesToString(rows, 'idUs')
            delete user[0].psw
            delete user[0].ruoloNU
            delete user[0].subruoloNU

            // console.log(user[0])

            res.json(user[0])
        } else {
            res.json(null)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query getLogData')
    }
})

module.exports = router