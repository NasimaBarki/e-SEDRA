'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const formData = require('express-form-data')
const config = require('../../config.json')

// setup router
const router = express.Router()
router.use(formData.parse())

// query
let resume = ''
let autoinc = undefined
let dtNow = undefined

if (config.database.dbms == 'My SQL') {
    autoinc = 'AUTO_INCREMENT'
    dtNow = 'DEFAULT NULL'
}
else if (config.database.dbms == 'SQL Server') {
    autoinc = 'IDENTITY(1,1)'
    dtNow = 'DEFAULT getdate() NOT NULL'
}

let query = `CREATE TABLE bisogni (
    idBs INT ${autoinc} NOT NULL PRIMARY KEY,
    ambito INT,
    moreambito VARCHAR(30),
    dtIns   DATETIME ${dtNow},
    utente INT NOT NULL,
	titleBis VARCHAR(60) NOT NULL,
    textBis VARCHAR(1024),
    imgBis VARCHAR(50),
	deleted INT NOT NULL DEFAULT 0,
    ingrad INT NOT NULL DEFAULT 0,
    pubblicato TINYINT NOT NULL,
	aggiornato DATETIME,
    dtRev DATETIME,
    rev VARCHAR(60),
    revisore INT,
    FOREIGN KEY (utente) REFERENCES utenti(idUs) ON DELETE CASCADE,
    FOREIGN KEY (ambito) REFERENCES ambiti(idAm) ON DELETE SET NULL,
    FOREIGN KEY (revisore) REFERENCES utenti(idUs) ON DELETE NO ACTION
);`

router.post('/bisogni', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS bisogni'
    }

    try {
        if (resume) {
            await sequelize.query(resume, {
                type: sequelize.QueryTypes.DROP
            })
        }

        await sequelize.query(query)

        res.send('Table bisogni creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post('/getallposts', async (req, res) => {
    const body = req.body
    console.log(body)
    const { table, role, idUs } = body
    let sql = ''

    // Determine SQL query based on user role
    if (role === 'revisor') {
        // Admin or Revisor can view all posts (fetch posts within the activity period)
        sql = `SELECT ${table}.*, nome, cognome 
               FROM ${table}, utenti 
               WHERE utenti.idUs = ${table}.utente
               AND ${table}.dtIns >= (SELECT dtStart FROM attivita WHERE idAT = 101) 
               AND ${table}.dtIns <= (SELECT dtStop FROM attivita WHERE idAT = 101) 
               ORDER BY ${table}.ambito, ${table}.pubblicato DESC, ${table}.deleted DESC`
    } else {
        // For regular users (iamAuthor), fetch only their posts
        sql = `SELECT ${table}.*, nome, cognome 
               FROM ${table}, utenti 
               WHERE utenti.idUs = ${table}.utente
               AND ${table}.utente = ${idUs}`
    }

    try {
        // Execute the query
        const [results] = await sequelize.query(sql)

        // Return the results as JSON response
        res.json(results)
    } catch (error) {
        console.error(error)
        res.status(500).send('Errore durante la query per ottenere i post')
    }
})

router.post('/postsdatelimited', async (req, res) => {
    const body = JSON.parse(req.body.data)
    const table = body.table
    const role = body.role
    const user_id = body.idUs
    let act = null
    let period = ''
    let sql = ''

    if (table == 'bisogni')
        act = 101
    else
        act = 201

    if (role == 'revisor') {
        period = ` AND dtIns >= (SELECT dtStart FROM attivita WHERE idAT=${act}) AND dtIns <= (SELECT dtStop FROM attivita WHERE idAT=${act})`
        sql = `SELECT ${table}.* ,nome, cognome FROM ${table},utenti WHERE utenti.idUs=utente".${period}." Order by ambito, pubblicato DESC, deleted DESC;`
    }
    else {
        sql = `SELECT ${table}.*,nome, cognome FROM ${table},utenti WHERE utenti.idUs=utente AND utente=${user_id};`
    }

    try {
        const [results, metadata] = await sequelize.query(sql)

        res.json(results)
    } catch (error) {
        console.log(error)
        res.sendStatus(500).send('Errore query GetAllPost')
    }
})

router.post('/createbisogni', async (req, res) => {
    const reqBody = req.body;
    console.log(reqBody)
    const title = reqBody.titleBis;
    const body = reqBody.textBis;
    const topicId = reqBody.topic_id || null;
    const moreAmbito = reqBody.moreambito || '';
    const hiddenPostId = reqBody.hidden_post_id || 0;
    const userId = reqBody.user_id;
    const publish = reqBody.publish ? 1 : 0;

    let crud = hiddenPostId == 0 ? 'C' : 'U';
    let errors = [];

    // Validate form data
    if (!title) {
        errors.push('Titolo del bisogno mancante');
    }
    if (!body) {
        errors.push('Corpo del bisogno vuoto');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // SQL query for stored procedure
    const sql = `CALL setBisogni(:how, :topic, :more, :title, :image, :body, :publish, :utente, :crud)`;

    try {
        const result = await sequelize.query(sql, {
            replacements: {
                how: hiddenPostId,
                topic: topicId,
                more: moreAmbito,
                title: title,
                image: null, // Placeholder for image handling
                body: body,
                publish: publish,
                utente: userId,
                crud: crud,
            },
        });

        // Determine success message
        const message = crud === 'C'
            ? 'Creazione bisogno terminata'
            : 'Aggiornamento bisogno avvenuto con successo';

        res.json({ success: message });
    } catch (error) {
        console.error('Errore query aggiorna bisogno:', error);
        res.status(500).send('Errore durante la creazione/aggiornamento del bisogno');
    }
});

router.post('/deletebisogni', async (req, res) => {
    const body = req.body
    console.log(body)
    const bisId = parseInt(body.bis_id)
    const clogic = body.clogic  // true for logical delete, false for actual delete

    // Define the SQL query
    let sql = 'CALL delBisogni(:how, :logic)'

    try {
        // Execute the stored procedure with the provided parameters
        await sequelize.query(sql, {
            replacements: {
                how: bisId,       // the ID of the post to delete
                logic: clogic // logical delete (1) or full delete (0)
            }
        })

        // Return a success message in JSON format
        res.json({ success: 'Bisogno cancellato' })
    } catch (error) {
        console.error('Error deleting post:', error)
        res.status(500).json({ error: 'Errore durante la cancellazione del bisogno' })
    }
})

module.exports = router