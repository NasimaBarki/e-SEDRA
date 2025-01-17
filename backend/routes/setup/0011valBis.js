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
let autoinc, dtNow = undefined
if (config.database.dbms == 'My SQL') {
    autoinc = 'AUTO_INCREMENT'
    dtNow = 'DEFAULT NULL'
}
else if (config.database.dbms == 'SQL Server') {
    autoinc = 'IDENTITY(1,1)'
    dtNow = 'DEFAULT getdate() NOT NULL'
}

let query = `CREATE TABLE valBis (
    idVb INT ${autoinc} NOT NULL PRIMARY KEY,
    dtIns   DATETIME ${dtNow},
    utente INT,
    bisogno INT NOT NULL,
    grade REAL,
    FOREIGN KEY (utente) REFERENCES utenti(idUs) ON DELETE NO ACTION,
    FOREIGN KEY (bisogno) REFERENCES bisogni(idBs) ON DELETE CASCADE
);`

router.post('/valBis', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS valBis'
    }

    try {
        if (resume) {
            await sequelize.query(resume, {
                type: sequelize.QueryTypes.DROP
            })
        }

        await sequelize.query(query)

        res.send('Table valBis creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post('/deletevalbis', async (req, res) => {
    const { idBis, idUs } = req.body // Assuming the request body contains the ID to delete

    if (!idBis || !idUs) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // SQL query to delete the record
    const sql = `DELETE FROM valBis WHERE bisogno = ${idBis} AND utente = ${idUs}`;

    try {
        // Execute the delete query
        await sequelize.query(sql, {
            replacements: { idBis, idUs },
            type: sequelize.QueryTypes.DELETE
        });

        // Send a success response
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting valBis record:', error);
        res.status(500).json({ error: 'Error deleting valBis record' });
    }
});

router.post('/getAllAnswersNotCanceled', async (req, res) => {
    const { ib, table, campo } = JSON.parse(req.body.data); // Get parameters from the request body

    try {
        // SQL query to fetch answers that are not canceled
        const sql = `
            SELECT b.*, u.nome AS anome, u.cognome AS acognome
            FROM ${table} AS b
            JOIN utenti AS u ON u.idUs = b.autore
            WHERE b.${campo} = :ib AND b.risp = 1 AND b.stato <> 3
            ORDER BY b.dtIns DESC;
        `;

        // Execute the query
        const [answers] = await sequelize.query(sql, {
            replacements: { ib },
        });

        // Send the result back as JSON
        res.json(answers);
    } catch (error) {
        console.error('Error fetching answers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/segnalacomment', async (req, res) => {
    console.log('ciao')
    const { idBl, itable, userId } = req.body

    if (!idBl || !itable || !userId) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    let query = `UPDATE blog${itable} SET stato = 1 WHERE idBl = :idBl`

    // Add the report entry to segnalaComm$itable
    if (config.database.dbms === 'My SQL') {
        query += `
            ;INSERT INTO segnalaComm${itable} (dtIns, utente, commento) 
            VALUES (NOW(), :userId, :idBl)`
    } else if (config.database.dbms === 'SQL Server') {
        query += `
            ;INSERT INTO segnalaComm${itable} (utente, commento) 
            VALUES (:userId, :idBl)`
    }

    try {
        // Execute the combined query (update + insert)
        await sequelize.query(query, {
            replacements: {
                idBl: idBl,
                userId: userId
            },
            type: sequelize.QueryTypes.UPDATE
        })

        res.json({ success: true, message: 'Comment reported successfully' })
    } catch (error) {
        console.error('Error reporting comment:', error)
        res.status(500).json({ success: false, message: 'Error reporting comment' })
    }
})

router.post('/getAllCommentsNotCanceled', async (req, res) => {
    const { ib, table, campo } = JSON.parse(req.body.data); // Get parameters from the request body

    try {
        // SQL query to fetch comments that are not canceled
        const sql = `
            SELECT b.*, u.nome AS anome, u.cognome AS acognome
            FROM ${table} AS b
            JOIN utenti AS u ON u.idUs = b.autore
            WHERE ${campo} = ${ib} AND b.risp = 0 AND b.stato <> 3
            ORDER BY b.dtIns DESC;
        `;

        // Execute the query
        const [comments] = await sequelize.query(sql);

        // Send the result back as JSON
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/getAutore', async (req, res) => {
    const { idUs } = JSON.parse(req.body.data); // Get the user ID from the request body

    try {
        // SQL query to get the name and surname of the user by idUs
        const sql = 'SELECT nome, cognome FROM utenti WHERE idUs = :idUs;';

        // Execute the query
        const [results] = await sequelize.query(sql, {
            replacements: { idUs }, // Replace the placeholder with the actual value
        });

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Combine first name and last name to return full name
        const fullName = `${results[0].nome} ${results[0].cognome}`;

        // Send the result back as JSON
        res.json({ fullName });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/getMyLikeB', async (req, res) => {
    console.log(JSON.parse(req.body.data))
    const { idB, idUs, at } = JSON.parse(req.body.data); // Receive parameters from the request body

    try {
        // SQL query to fetch the likes for a specific bisogno (idB) and user (idUs) within a date range defined by 'at'
        const sql = `
            SELECT * FROM miPiaceB
            WHERE bisogno = ${idB}
            AND utente = ${idUs}
            AND miPiaceB.dtIns BETWEEN (SELECT dtStart FROM attivita WHERE idAt = ${at})
            AND (SELECT dtStop FROM attivita WHERE idAt = ${at});
        `;

        // Execute the query
        const [results] = await sequelize.query(sql, {
            replacements: { idB, idUs, at },
        });

        // Send the results back as JSON
        console.log('like: ', results)
        res.json(results);
    } catch (error) {
        console.error('Error fetching my likes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/getMyLikeBAllPost', async (req, res) => {
    const body = JSON.parse(req.body.data)
    // console.log(body)
    let sql = `SELECT * FROM miPiaceB WHERE bisogno=${body.idBs} AND utente=${body.idUs}`
    let sqd = ` AND miPiaceB.dtIns between (SELECT dtStart FROM attivita WHERE idAt=${body.at}) AND (SELECT dtStop FROM attivita WHERE idAt=${body.at});`;

    try {
        // Execute the query
        const [results, metadata] = await sequelize.query(sql + sqd)

        // Return the results as JSON response
        // console.log(results)
        res.json(results)
    } catch (error) {
        console.error(error)
        res.status(500).send('Errore durante la query per ottenere i post')
    }
    return 1
})

router.post('/getAllPublishBisWithGrade', async (req, res) => {
    const { anonym, field, userId } = JSON.parse(req.body.data)
    let sql = '';  // Assuming the user ID is in session

    if (!anonym) {
        sql = `
            SELECT t.*, idVb, grade 
            FROM (
                SELECT b.*, a.ambito as ambitonome, a.valenza, u.nome, u.cognome 
                FROM bisogni AS b
                JOIN utenti AS u ON b.utente = u.idUs
                JOIN ambiti AS a ON b.ambito = a.idAm
                WHERE b.dtIns >= (SELECT dtStart FROM attivita WHERE idAt = 101) 
                AND b.dtIns <= (SELECT dtStop FROM attivita WHERE idAt = 101)
                AND b.${field} = 1
                AND b.deleted <> 1
            ) AS t
            LEFT JOIN valBis ON t.idBs = valBis.bisogno 
            AND valBis.utente = ${userId}
        `;
    } else {
        sql = `
            SELECT t.*, idVb, grade 
            FROM (
                SELECT b.*, a.ambito as ambitonome, a.valenza 
                FROM bisogni AS b
                JOIN ambiti AS a ON b.ambito = a.idAm
                WHERE b.dtIns >= (SELECT dtStart FROM attivita WHERE idAt = 101) 
                AND b.dtIns <= (SELECT dtStop FROM attivita WHERE idAt = 101)
                AND b.${field} = 1
                AND b.deleted <> 1
            ) AS t
            LEFT JOIN valBis ON t.idBs = valBis.bisogno 
            AND valBis.utente = ${userId}
        `;
    }

    const dateRange = `
        AND valBis.dtIns BETWEEN (SELECT dtStart FROM attivita WHERE idAt = 104)
        AND (SELECT dtStop FROM attivita WHERE idAt = 104)
        ORDER BY t.ambito, t.idBs;
    `;

    try {
        const [results] = await sequelize.query(sql + dateRange,);

        res.json(results);
    } catch (error) {
        console.error('Error fetching posts with grade:', error);
        res.status(500).json({ error: 'Error fetching posts with grade' });
    }
});

module.exports = router