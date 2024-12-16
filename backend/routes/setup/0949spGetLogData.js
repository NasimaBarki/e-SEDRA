'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')
const cors = require('cors')
const roles = require('../../js/utilfunctions')
const fs = require('fs')

// setup router 
const router = express.Router()

router.use(cors({ exposedHeaders: ['Content-Disposition'] }))

// query
let query = ''
let type = undefined

if (config.database.dbms == 'My SQL')
    query = `CREATE PROCEDURE getLogData()
    BEGIN
       select logs.idLg,  DATE_FORMAT(logs.dtStart, '%d/%m/%Y %T') AS dtS, DATE_FORMAT(logs.dtEnd, '%d/%m/%Y %T') AS dtE,
        ut.cognome, ut.nome, ut.email, ut.ruolo, ut.subruolo
        FROM logs, (select t.email, t.idUs, t.nome, t.cognome, t.ruolo, ruoli.ruolo as subruolo
        from (SELECT utenti.idUs, utenti.nome, utenti.cognome, utenti.email, ruoli.ruolo, ruoliUtenti.subruolo as subruolo
        FROM utenti left JOIN (
            ruoliUtenti inner join ruoli on ruoliUtenti.ruolo=ruoli.idRl )  ON utenti.idUs=ruoliUtenti.utente) as t left join  ruoli on t.subruolo=ruoli.idRl) as ut
        WHERE logs.utente=ut.idUs;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getLogData
    AS
        BEGIN
                SET NOCOUNT ON;
               select logs.idLg,  FORMAT(logs.dtStart, 'dd/MM/yyyy hh:mm') AS dtS, FORMAT(logs.dtEnd, 'dd/MM/yyyy hh:mm') AS dtE,
                ut.cognome, ut.nome, ut.email, ut.ruolo, ut.subruolo
                FROM logs, (select t.email, t.idUs, t.nome, t.cognome, t.ruolo, ruoli.ruolo as subruolo
                from (SELECT utenti.idUs, utenti.nome, utenti.cognome, utenti.email, ruoli.ruolo, ruoliUtenti.subruolo as subruolo
                FROM utenti left JOIN (
                ruoliUtenti inner join ruoli on ruoliUtenti.ruolo=ruoli.idRl )  ON utenti.idUs=ruoliUtenti.utente) as t left join  ruoli on t.subruolo=ruoli.idRl
                ) as ut
                WHERE logs.utente=ut.idUs;
        END`

router.post('/spGetLogData', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getLogData creata...')
})

async function getLogData() {
    try {
        if (config.database.dbms == 'SQL Server') {
            query = 'EXEC getLogData'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL getLogData'

            type = true
        }

        const [results, metadata] = await sequelize.query(query, {
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        if (results) {
            return roles.rolesToString(results, 'idLg')
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query getLogData')
    }
}

router.get('/getLogData', async (req, res) => {
    try {
        if (config.database.dbms == 'SQL Server') {
            query = 'EXEC getLogData'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL getLogData'

            type = true
        }

        const [results, metadata] = await sequelize.query(query, {
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        if (results) {
            res.json(roles.rolesToString(results, 'idLg'))
        } else {
            res.json(null)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query getLogData')
    }
})

router.post('/deletelogs', async (req, res) => {
    query = 'DELETE FROM logs;'
    try {
        if (config.database.dbms == 'SQL Server') {
            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            type = true
        }

        await sequelize.query(query, {
            ...type && { type: sequelize.QueryTypes.DELETE }
        })

        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query delete logs')
    }
})


router.get('/writelogs', async (req, res) => {
    // creazione contenuto del file
    var text = ''

    let header = ['Data Login', 'Data Logout', 'Cognome', 'Nome', 'Email', 'Ruoli']
    for (let i = 0; i < header.length; i++) {
        if (i == 0)
            text = header[i]
        else
            text += ';' + header[i]
    }

    text += '\n'

    let rows = await getLogData()
    for (let i = 0; i < Object.keys(rows).length; i++) {
        // console.log('"' + rows[i].ruolo + '"')

        text += rows[i].dtS
        if (rows[i].dtE)
            text += ';' + rows[i].dtE
        else
            text += ';###'
        text += ';' + rows[i].cognome
        text += ';' + rows[i].nome
        text += ';' + rows[i].email
        text += ';' + rows[i].ruolo + '\n'
    }

    // creazione file
    let fileName = 'log' + Math.floor(new Date().getTime() / 1000) + '.csv'
    fs.writeFileSync(fileName, text, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!")
    })

    res.setHeader("Content-disposition", "attachment; filename=" + fileName)

    var file = fs.readFileSync(fileName, 'binary')

    res.attachment(fileName)
    res.type('csv')
    res.send(file)

    fs.unlinkSync(fileName)

})

module.exports = router