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
    query = `CREATE PROCEDURE getMoment()
    BEGIN
            SELECT * FROM attivita
            WHERE now() between dtStart AND dtStop;
    END`
else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE getMoment
    AS
    BEGIN
        SET NOCOUNT ON;
            SELECT * FROM attivita
            WHERE (getdate() between dtStart AND dtStop);
    END`

router.post('/spGetMoment', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure getMoment creata...')
})

// function calcolaTempoAllaScadenza(dtSto) {
//     let now = Date.now()
//     return {
//         g: Math.floor(Math.abs(now - dtSto) / (1000 * 60 * 60 * 24)),
//         h: Math.floor(Math.abs(now - dtSto) / (1000 * 60 * 60 ))
//     }
// }
function calcolaTempoAllaScadenza(dtSto) {
    const italianTimezone = 'Europe/Rome';

    // Current time in the Italian timezone
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: italianTimezone }));

    // Target time in the Italian timezone
    const target = new Date(new Date(dtSto).toLocaleString('en-US', { timeZone: italianTimezone }));

    // Calculate the difference in milliseconds
    const diffMs = target - now;

    // Convert milliseconds into days, hours, minutes, and seconds
    const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const h = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const i = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diffMs % (1000 * 60)) / 1000);

    return { d, h, i, s };
}

async function getRuoliAutorizzati(idAt) {
    try {
        let sql = "SELECT ruolo, sottoruolo FROM attRuoli WHERE activity=" + idAt + ";"

        let [results, metadata] = await sequelize.query(sql)
        let rauth = []
        for (let i in results) {
            rauth.push(results[i].ruolo)
            if (results[i].sottoruolo != null)
                rauth.push(results[i].sottoruolo)
            else
                rauth.push(0)
        }
        // console.log(rauth)

        return rauth
    } catch (error) {

    }
}
router.get('/getMoment', async (req, res) => {
    let sql = 'CALL getMoment'
    try {
        let [results, metadata] = await sequelize.query(sql)
        let n = 0
        if (results != undefined) {
            results = [results]
            for (let i = 0; i < results.length; i++) {
                for (const [key, value] of Object.entries(results[i])) {
                    if (JSON.stringify(value).includes('Buffer')) {
                        let num = JSON.stringify(value).slice(-3, JSON.stringify(value).length - 2)
                        results[i][key] = parseInt(num)
                    }
                }
            }
            n = results.length

            for (let i in results) {
                delete results[i].note
                if (results[i].active) {
                    let tot = calcolaTempoAllaScadenza(results[i].dtStop)
                    results[i].ggscad = ' ' + tot.d + 'g ' + tot.h + 'h ' + tot.i + 'm ' + tot.s + 's '
                    let key = results[i].idAt
                    results[i].idAt
                    let author = await getRuoliAutorizzati(key)
                    results[i].author = author
                }
            }

            res.json(results)
        }

        if (n == 0)
            res.json({ 'error': 'Non ci sono attività attive in questo momento.' })
    } catch (error) {
        console.log(error)
        res.sendStatus(500).send('Errore query getMoment')
    }
})

module.exports = router