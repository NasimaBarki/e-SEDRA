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

// Express route to toggle 'pubblicato' in the database
router.post('/togglepublication', async (req, res) => {
    console.log(req.body)
    const { id, table } = req.body;
    let field = table === 'bisogni' ? 'idBs' : 'idPr';
    let newPub = 0; // Default value for the toggle

    try {
        // Check current 'pubblicato' status
        let [result] = await sequelize.query(`SELECT pubblicato FROM ${table} WHERE ${field} = ${id}`);
        result = result[0]
        console.log(result)

        if (result.pubblicato != null) {
            // Toggle the 'pubblicato' field
            newPub = result.pubblicato === 1 ? 0 : 1;
            await sequelize.query(`UPDATE ${table} SET pubblicato = ${newPub} WHERE ${field} = ${id}`);
        }

        res.json({ pubblicato: newPub });
    } catch (error) {
        console.error('Error toggling pubblicato:', error);
        res.status(500).json({ error: 'Error updating pubblicato' });
    }
});


router.post('/revisionabisogno', async (req, res) => {
    const { titleBis, textBis, topic_id, moreambito, hidden_post_id, publish, user_id, NdR, crud } = req.body;
    let errors = [];

    console.log(req.body)

    // Validation
    if (!titleBis && crud !== 'D') errors.push("Titolo del bisogno mancante");
    if (!textBis && crud !== 'D') errors.push("Corpo del bisogno vuoto");
    if (crud !== 'D' && !topic_id) errors.push("Ambito obbligatorio in fase di revisione");

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Prepare the SQL query
    let sql = "CALL revBisogni(:hidden_post_id, :topic_id, :moreambito, :titleBis, :textBis, :image, :publish, :user_id, :note, :crud)";
    try {
        await sequelize.query(sql, {
            replacements: {
                hidden_post_id: hidden_post_id,
                topic_id: topic_id,
                moreambito: moreambito,
                titleBis: titleBis,
                textBis: textBis,
                image: null, // Placeholder for image
                publish: publish || 0,
                user_id: user_id,
                note: NdR,
                crud: crud
            }
        });

        const successMessage = crud === 'R' ? 'Revisione bisogno effettuata' : 'Cancellazione logica bisogno avvenuta con successo';
        res.json({ success: successMessage });
    } catch (error) {
        console.error('Error in revising bisogno:', error);
        res.status(500).json({ error: 'Errore durante la revisione del bisogno' });
    }
});


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
        sql = `SELECT ${table}.* ,nome, cognome FROM ${table},utenti WHERE utenti.idUs=utente ${period} Order by ambito, pubblicato DESC, deleted DESC;`
    }
    else {
        sql = `SELECT ${table}.*,nome, cognome FROM ${table},utenti WHERE utenti.idUs=utente AND utente=${user_id};`
    }

    try {
        // console.log(sql)
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

router.post('/getsinglebisogno', async (req, res) => {
    const body = req.body;
    const idBis = parseInt(body.idBis);
    const pub = body.pub;

    console.log(body)

    // SQL query to call the stored procedure (similar to the PHP code)
    const sql = `CALL getSingleBisogno(:idBis, :pub)`;

    try {
        // Execute the query
        const [results] = await sequelize.query(sql, {
            replacements: {
                idBis: idBis,
                pub: pub,
            },
        });

        // Return the result as JSON
        res.json(results); // Assuming the result is a single row
    } catch (error) {
        console.error('Error retrieving single bisogno:', error);
        res.status(500).json({ error: 'Errore durante il recupero del bisogno singolo' });
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

async function getPostTopic(tpc_id) {
    try {
        // SQL query to fetch the 'ambito' based on tpc_id
        const sql = 'SELECT ambito FROM ambiti WHERE idAm = :tpc_id';

        // Execute the query
        const [results] = await sequelize.query(sql, {
            replacements: { tpc_id },
        });

        if (results.length > 0) {
            // Return the ambito value from the result
            return results[0].ambito;
        } else {
            throw new Error('Topic not found');
        }
    } catch (error) {
        console.error('Error fetching post topic:', error);
        throw new Error('Internal Server Error');
    }
}

router.post('/getOnePublishBisWithGrade', async (req, res) => {
    console.log(JSON.parse(req.body.data))
    const { idB, field, anonim, userId } = JSON.parse(req.body.data) // Assuming data is sent in request body (POST)

    if (typeof anonim === 'undefined') {
        anonim = true; // Default to true if not provided
    }

    try {
        // Initialize the base SQL query
        let sql;
        if (!anonim) {
            sql = `
                SELECT t.*, idVb, grade
                FROM (
                    SELECT b.*, nome, cognome
                    FROM bisogni as b
                    JOIN utenti as u ON b.utente = u.idUs
                    WHERE b.${field} = 1 AND b.deleted <> 1 AND b.idBs = ${idB}
                ) AS t
                LEFT JOIN valBis ON t.idBs = valBis.bisogno AND valBis.utente = {userId}
            `;
        } else {
            sql = `
                SELECT t.*, idVb, grade
                FROM (
                    SELECT * FROM bisogni
                    WHERE ${field} = 1 AND deleted <> 1 AND idBs = ${idB}
                ) AS t
                LEFT JOIN valBis ON t.idBs = valBis.bisogno AND valBis.utente = ${userId}
            `;
        }

        // Add date range filter
        sql += `
            AND valBis.dtIns BETWEEN 
                (SELECT dtStart FROM attivita WHERE idAt = 104) AND 
                (SELECT dtStop FROM attivita WHERE idAt = 104);
        `;

        // Prepare and execute the query using Sequelize or another method (e.g., mysql2, pg)
        const [results] = await sequelize.query(sql, {
            replacements: {
                idB, // The 'idBs' parameter
                userId // Assuming user ID is stored in session
            },
        });

        // If post exists, fetch the topic (ambitoName)
        if (results.length > 0) {
            const post = results[0];
            // You might need to replace this with an actual function to fetch the topic
            post.ambitoName = await getPostTopic(post.ambito); // Assuming getPostTopic is implemented elsewhere
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router