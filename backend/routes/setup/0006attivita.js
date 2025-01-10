'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')
const formData = require('express-form-data')
const roles = require('../../js/utilfunctions')

// setup router
const router = express.Router()
router.use(formData.parse())

// query
let resume = ''
let bit = ''
let type = undefined
let queryInsert = `INSERT INTO attivita (idAt, nome, active, anonima, dipendeda, note) VALUES
    (101,'Segnalazione Bisogni',1,1,NULL,''),(102,'Revisione Bisogni',1,0,101,''),(103,'Discussione Bisogni',0,0,102,'Elimina post bisogni dopo settimane'),
    (104,'Votazione Bisogni',1,0,102,'0 Singola 1 Graduatoria'),(105,'Pubblicazione Bisogni',1,0,104,'sulla home page'),
    (201,'Inserimento Proposte',1,1,105,''),(202,'Revisione Proposte',1,0,201,''),(203,'Discussione Proposte',0,0,202,'Elimina post proposte dopo settimane'),
    (204,'Votazione Proposte',1,0,202,'0 Singola 1 Graduatoria'),(205,'Pubblicazione Proposte',1,0,204,'sulla home page'),
    (300,'Pubblicazione News',1,1,NULL,'Elimina news dopo settimane');`

if (config.database.dbms == 'My SQL') {
    bit = '(1)'
}

let query = `CREATE TABLE attivita (
    idAt  INT NOT NULL PRIMARY KEY,
    nome VARCHAR (35) NOT NULL,
    active BIT` + bit + ` DEFAULT 1,
    anonima BIT` + bit + ` DEFAULT 0,
    ballottaggio BIT` + bit + ` DEFAULT 0,
    stato INT DEFAULT 0,
    dipendeda INT,
    giorninoti INT DEFAULT 3,
    dtStart DATETIME,
    notistart BIT` + bit + ` DEFAULT 0,
    dtStop DATETIME,
    notistop BIT` + bit + ` DEFAULT 0,
    revisore INT,
    altridati INT,
    note VARCHAR(60),
    FOREIGN KEY (dipendeda) REFERENCES attivita(idAt) ON DELETE NO ACTION,
    FOREIGN KEY (revisore) REFERENCES ruoli(idRl) ON DELETE NO ACTION
);`

router.post('/attivita', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS attivita'
    }

    try {
        if (resume) {
            await sequelize.query(resume, {
                type: sequelize.QueryTypes.DROP
            })
        }

        await sequelize.query(query, {
            type: sequelize.QueryTypes.CREATE
        })

        await sequelize.query(queryInsert, {
            type: sequelize.QueryTypes.INSERT
        })

        res.send('Table attivita creata')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

function setAttivitaScadIncorso(act) {
    // Set timezone (JavaScript will use the client's timezone, unlike PHP)
    const today = new Date();

    const stato = act.stato;

    if (act.dtStart != null && act.dtStop != null && act.active) {
        const din = new Date(act.dtStart);   // Convert dtStart to a Date object
        const dfin = new Date(act.dtStop);   // Convert dtStop to a Date object

        // Check if the current date is within the start and stop date range
        if (today >= din && today <= dfin) {
            act.stato = "1";  // in corso (in progress)
        } else if (today > din && today > dfin) {
            act.stato = "2";  // scaduta terminata riprogrammabile (expired and reprogrammable)
        } else if (today < din && today < dfin) {
            act.stato = "0";  // non ancora partita (not started yet)
        }
    } else {
        act.stato = "0";  // attiva/da attivare non ancora partita (active, not yet started)
    }

    // If stato has changed, update the database (or perform an equivalent action in JS)
    if (stato !== act.stato) {
        aggiornaStatoInDB(act.idAt, act.stato);  // Implement the database update logic in JS or an API call
    }
}

async function aggiornaStatoInDB(ida, sta) {
    let sql = "UPDATE attivita SET stato='" + sta + "'WHERE idAt=" + ida + ";"

    try {
        await sequelize.query(sql)
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query getAttivita')
    }
}

router.get('/ruoliAttivita', async (req, res) => {
    query = 'SELECT attivita.*,ruoli.ruolo as rev FROM attivita left join ruoli on ruoli.idRl=attivita.revisore;'
    if (config.database.dbms == 'SQL Server') {
        type = false
    }
    else if (config.database.dbms == 'My SQL') {
        type = true
    }

    try {
        const [ac, metadata] = await sequelize.query(query, {
            ...type && { type: sequelize.QueryTypes.RAW }
        })

        for (let i = 0; i < ac.length; i++) {
            for (const [key, value] of Object.entries(ac[i])) {
                if (JSON.stringify(value).includes('Buffer')) {
                    let num = JSON.stringify(value).slice(-3, JSON.stringify(value).length - 2)
                    ac[i][key] = parseInt(num)
                }
            }
        }

        for (let i in ac) {
            setAttivitaScadIncorso(ac[i])

            let sql = ""

            if (config.database.dbms == 'SQL Server') {
                sql = 'CALL getRolesActivities(:ida)'

                type = false
            }
            else if (config.database.dbms == 'My SQL') {
                sql = 'CALL getRolesActivities(:ida)'

                type = true
            }

            const [ra, metadataa] = await sequelize.query(sql, {
                ...type && { replacements: { ida: ac[i].idAt } },
                ...type && { type: sequelize.QueryTypes.RAW }
            })

            if (ra) {
                ac[i].raut = ra.ruolo
            }
        }
        res.json(ac)

    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query getAttivita')
    }
})

router.post('/updateactivity', async (req, res) => {
    const select = req.body.select
    let idAt = req.body.idAt
    const blog = req.body.blog
    let dtStart = req.body.dtStart
    let dtStop = req.body.dtStop
    const grad = req.body.grad
    const indPost = req.body.ind
    const altridati = req.body.altridati
    const active = req.body.active
    const anonima = req.body.anonima
    const stato = req.body.stato
    const revisore = req.body.revisore
    const giorninoti = req.body.giorninoti
    const ballottaggio = req.body.ballottaggio

    let idprec = 0
    let controllo = null
    let qsql = ''
    let sqla = 'UPDATE attivita SET '
    let sqlb = 'UPDATE attivita SET '
    let sqlc = 'UPDATE attivita SET '
    let sqls = ''
    let sql = ''
    let riga = null

    if (Array.isArray(idAt))
        idAt = idAt[0]

    if (idAt) {
        let ida = idAt

        if (blog && (ida == 204 || ida == 104)) {
            idprec = ida - 1
            if (blog == 1)
                sqlb += ' active = 1,'
            else
                sqlb += ' active = 0,'
        }
        if (dtStart) {
            dtStart = new Date(dtStart)
            let datestart = dtStart.toISOString().slice(0, 19).replace('T', ' ')

            sqla += ' dtStart = \'' + datestart + '\','
            if (idprec != 0)
                sqlb += ' dtStart = \'' + datestart + '\','
        }
        if (dtStop) {
            dtStop = new Date(dtStop)
            let datestop = dtStop.toISOString().slice(0, 19).replace('T', ' ')

            sqla += ' dtStop = \'' + datestop + '\','
            if (idprec != 0)
                sqlb += ' dtStop = \'' + datestop + '\','
        }

        if (grad && grad == 1 && (ida == 204 || ida == 104)) {
            let field = 'vbis'

            if (ida == 204)
                field = 'vpro'

            for (let i = 1; i <= 10; i++) {
                let ind = 'val' + i
                let sta = indPost
                sqls += 'UPDATE numberOfStars SET ' + field + '= ' + sta + ' WHERE idstar=' + i
            }

            sqla += ' altridati=1,'
        }
        else if (grad && grad == 0 && (ida == 204 || ida == 104)) {
            sqla += ' altridati=0,'
        }

        if (altridati && (ida == 103 || ida == 203 || ida == 300)) {
            sqla += " altridati='" + altridati + "',"
        }
        if (active) {
            let chk = 1
            if (active == false)
                chk = 0
            sqla += ' active = ' + chk + ','
        }
        if (anonima) {
            let chk = 1
            if (anonima == false)
                chk = 0
            sqla += ' anonima = ' + chk + ','
        }
        if (stato) {
            sqla += ' stato = ' + stato + ','
        }
        if (revisore) {
            sqla += ' revisore = ' + revisore + ','
            if (ida == 101 || ida == 201) {
                let idnex = ida + 1
                sqlc += ' revisore = ' + revisore + ','
            }
            if (idprec != 0)
                sqlb += ' revisore = ' + revisore + ','
        }
        if (giorninoti) {
            sqla += ' giorninoti = ' + giorninoti + ','
        }
        if (ballottaggio) {
            if (ballottaggio == 1)
                controllo = ida + 1
            else
                controllo = 0

            sqla += ' ballottaggio = ' + ballottaggio + ','
        }
        if (sqla != 'UPDATE attivita SET ') {
            if (sqla.charAt(sqla.length - 1) == ',')
                sqla = sqla.slice(0, -1)
            sqla += ' WHERE idAt = ' + idAt + ';'
            qsql += sqla
        }
        if (sqlb != 'UPDATE attivita SET ') {
            if (sqlb.charAt(sqlb.length - 1) == ',')
                sqlb = sqlb.slice(0, -1)
            sqlb += ' WHERE idAt = ' + idAt + ';'
            qsql += sqlb
        }
        if (sqlc != 'UPDATE attivita SET ') {
            if (sqlc.charAt(sqlc.length - 1) == ',')
                sqlc = sqlc.slice(0, -1)
            sqlc += ' WHERE idAt = ' + idAt + ';'
            qsql += sqlc
        }
        if (sqls != '')
            qsql += sqsl
        if (qsql != '') {
            try {
                await sequelize.query(qsql)
            } catch (error) {
                console.log(error)
                res.status(500).send('Errore query aggiorna attivita')
            }
        }
        if (controllo != null) {
            // TODO: 
            console.log('FAI IL CONTROLLO')
        }
        if (select) {
            sql = "SELECT attivita.*,ruoli.ruolo as rev FROM attivita left join ruoli on ruoli.idRl=attivita.revisore WHERE idAt=" + ida + ";"
        }
        else
            sql = "SELECT attivita.*,ruoli.ruolo as rev FROM attivita left join ruoli on ruoli.idRl=attivita.revisore WHERE idAt=" + ida + ";";

        try {
            if (config.database.dbms == 'SQL Server') {
                type = false
            }
            else if (config.database.dbms == 'My SQL') {
                type = true
            }
            let [results, metadata] = await sequelize.query(sql, {
                ...type && { type: sequelize.QueryTypes.SELECT }
            })
            riga = results

            if (riga.idAt == 104 || riga.idAt == 204) {
                let idisc = riga.idAt - 1
                sql = "SELECT attivita.active FROM attivita WHERE idAt=" + idisc + ";"
            }

            [results, metadata] = await sequelize.query(sql, {
                ...type && { type: sequelize.QueryTypes.SELECT }
            })

            riga.blog = results.active

            if (riga.dtStart && riga.dtStop) {
                riga.dtStart = `${riga.dtStart.getFullYear()}-${(riga.dtStart.getMonth() + 1).toString().padStart(2, '0')}-${riga.dtStart.getDate().toString().padStart(2, '0')}T${riga.dtStart.getHours().toString().padStart(2, '0')}:${riga.dtStart.getMinutes().toString().padStart(2, '0')}`
                riga.dtStop = `${riga.dtStop.getFullYear()}-${(riga.dtStop.getMonth() + 1).toString().padStart(2, '0')}-${riga.dtStop.getDate().toString().padStart(2, '0')}T${riga.dtStop.getHours().toString().padStart(2, '0')}:${riga.dtStop.getMinutes().toString().padStart(2, '0')}`
            }

            for (const [key, value] of Object.entries(riga)) {
                if (JSON.stringify(value).includes('Buffer')) {
                    let num = JSON.stringify(value).slice(-3, JSON.stringify(value).length - 2)
                    riga[key] = parseInt(num)
                }
            }

            res.json(riga)
        } catch (error) {
            console.log(error)
            res.status(500).send('Errore query seleziona attivita')
        }
    }
})

router.post('/updateroleactivity', async (req, res) => {
    console.log('eao')
    console.log(req.body)

    const ida = req.body.activity
    const ruoli = JSON.parse(req.body.ruoli)

    console.log(ruoli)
    if (ruoli) {
        let sql = 'DELETE FROM attRuoli WHERE activity=' + ida + ';'
        let t = 0
        let rol = null
        let sub = null
        let nosub = 0

        for (let r in ruoli) {
            if (t == 0) {
                rol = ruoli[r]
                t++
            }
            else {
                if (ruoli[r] == 0)
                    nosub = 1
                else {
                    sub = ruoli[r]
                    nosub = 0
                }
                t = 0
            }
            if (t == 0) {
                if (nosub == 1)
                    sql += ' INSERT INTO attRuoli (activity, ruolo) VALUES(' + ida + ',' + rol + ');'
                else
                    sql += ' INSERT INTO attRuoli (activity, ruolo, sottoruolo) VALUES(' + ida + ',' + rol + ', ' + sub + ');'
            }
        }

        try {
            await sequelize.query(sql)

            res.json(0)
        } catch (error) {
            console.log(error)
            res.status(500).send('Errore query ruoli attivita')
        }
    }
})

router.post('/resetactivity', async (req, res) => {
    const ida = req.body.idAt
    let sql = ''
    if (ida) {
        let anon = 0
        let ack = 1
        if (ida == 103 || ida == 203)
            ack = 0
        if (ida == 101 || ida == 201 || ida == 300)
            anon = 1

        sql += "UPDATE attivita SET active=" + ack + ", anonima=" + anon + ", ballottaggio=0, stato=DEFAULT, giorninoti=DEFAULT,"
        sql += "dtStart=NULL, notistart=DEFAULT, dtStop=NULL, notistop=DEFAULT, revisore=NULL, altridati=NULL WHERE idAt=" + ida + ";"
        sql += "DELETE FROM attRuoli WHERE activity = " + ida + ";"

        if (ida == 104)
            sql += "UPDATE numberOfStars SET vbis=1;"
        else if (ida == 204)
            sql += "UPDATE numberOfStars SET vpro=1;"

        try {
            await sequelize.query(sql)

            sql = "SELECT * FROM attivita WHERE idAt = " + ida + ";"
            const [results, metadata] = await sequelize.query(sql, { type: sequelize.QueryTypes.RAW })


            console.log(results)
            res.json(results[0])
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    }
})

router.post('/deletedatact', async (req, res) => {
    const ida = parseInt(req.body.idAt)
    let output = {}
    let sql = ''

    if (ida) {
        sql = "SELECT stato FROM attivita WHERE idAt = " + ida + ";"

        try {
            let [rec, metadata] = await sequelize.query(sql, { type: sequelize.QueryTypes.RAW })
            rec = rec[0]

            if (rec.stato == 2) {
                switch (ida) {
                    case 101:
                        sql = "DELETE FROM bisogni;";
                        output.success = "Bisogni eliminati definitivamente";
                        break;
                    case 102:
                        // No deletion for case 102
                        output.success = "Dati cancellati"
                        break;
                    case 103:
                        sql = "DELETE FROM segnalaCommB; DELETE FROM blogB;";
                        output.success = "Commenti sui Bisogni eliminati definitivamente";
                        break;
                    case 104:
                        sql = "DELETE FROM valBis; DELETE FROM miPiaceB;";
                        output.success = "Voti e like sui Bisogni eliminati definitivamente";
                        break;
                    case 105:
                        sql = "DELETE FROM gradBisogni;";
                        output.success = "Graduatoria Bisogni eliminata definitivamente";
                        break;
                    case 201:
                        sql = "DELETE FROM propBis; DELETE FROM proposte;";
                        output.success = "Proposte eliminati definitivamente";
                        break;
                    case 202:
                        // No deletion for case 202
                        break;
                    case 203:
                        sql = "DELETE FROM segnalaCommP; DELETE FROM blogP;";
                        output.success = "Commenti sulle Proposte eliminati definitivamente";
                        break;
                    case 204:
                        sql = "DELETE FROM valPrp; DELETE FROM miPiaceP;";
                        output.success = "Voti e like delle Proposte eliminati definitivamente";
                        break;
                    case 205:
                        sql = "DELETE FROM gradProposte;";
                        output.success = "Graduatoria Proposte eliminata definitivamente";
                        break;
                    default:
                        output.error = "Attività non riconosciuta";
                        break;
                }

                if (sql) {
                    // Execute the delete query
                    await sequelize.query(sql, { type: sequelize.QueryTypes.RAW });
                } else {
                    output.error = "L'attività non ha dati da cancellare";
                }
            } else {
                output.error = "Attività in corso, dati non cancellabili";
            }
        } catch (error) {
            console.log(error)
            res.sendStatus(500).send('Errore query select attivita')
        }
    }
    else {
        output.error = "Attività non specificata";
    }
    console.log('output: ', output)

    res.json(output);

})
module.exports = router