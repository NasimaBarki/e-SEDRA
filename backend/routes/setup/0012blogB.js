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

let query = `CREATE TABLE blogB
(
	idBl INT NOT NULL ${autoinc} PRIMARY KEY,
	autore INT NOT NULL,
    bisogno INT NOT NULL,
	content VARCHAR(1024) NOT NULL,
    dtIns DATETIME ${dtNow},
    stato INT NOT NULL DEFAULT 0,
    dtRev DATETIME,
    revisore INT,
    note VARCHAR(40),
    risp TINYINT DEFAULT 0,
    idMaster INT,
	FOREIGN KEY(autore) REFERENCES utenti(idUs) ON DELETE NO ACTION,
    FOREIGN KEY(revisore) REFERENCES utenti(idUs) ON DELETE NO ACTION,
    FOREIGN KEY(bisogno) REFERENCES bisogni(idBs) ON DELETE NO ACTION,
    FOREIGN KEY (idMaster) REFERENCES blogB(idBl) ON DELETE NO ACTION
);`

router.post('/blogB', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS blogB'
    }

    try {
        if (resume) {
            await sequelize.query(resume, {
                type: sequelize.QueryTypes.DROP
            })
        }

        await sequelize.query(query)

        res.send('Table blogB creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post('/setComment', async (req, res) => {
    const {
        idOrigin, // The ID of the original post or item
        btnCom,
        testoCommento, // The content of the comment
        risp, // Response indicator (presumably a boolean or flag)
        master, // The ID of the master post (could be null)
        itable, // The table ('B' or 'P' for 'bisogno' or 'proposta')
        us
    } = req.body;
    console.log(req.body)

    // Sanitize input (this should be done properly in the backend)
    const cmt = testoCommento; // You may want to escape or sanitize inputs depending on your needs
    const idB = idOrigin; // Assuming session is properly set
    const tableField = itable === 'B' ? 'bisogno' : 'proposta';

    try {
        // Build SQL query for insertion
        const query = `
            INSERT INTO blog${itable} (autore, ${tableField}, content, risp, idMaster, dtIns)
            VALUES (${us}, ${idB}, '${cmt}', ${risp}, ${master}, NOW())
        `;

        // Execute the query using Sequelize
        await sequelize.query(query);

        // Respond with the inserted ID (or original ID)
        res.json({ success: true, idB });

    } catch (error) {
        console.error('Error inserting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router
