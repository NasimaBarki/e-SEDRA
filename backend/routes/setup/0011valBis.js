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

router.post('/getAllPublishBisWithoutGrade', async (req, res) => {
    const { anonym, field, userId } = JSON.parse(req.body.data);  // Get anonym, field, and userId from request body

    let sql = ''; // SQL query placeholder

    // Check if anonym is false (similar to $anonim in PHP)
    if (!anonym) {
        // SQL query when anonym is false
        sql = `
            SELECT t.*, idmi AS nlike
            FROM (
                SELECT b.*, a.ambito AS ambitonome, a.valenza, u.nome, u.cognome
                FROM bisogni AS b
                JOIN utenti AS u ON b.utente = u.idUs
                JOIN ambiti AS a ON b.ambito = a.idAm
                WHERE b.dtIns >= (SELECT dtStart FROM attivita WHERE idAt = 101)
                AND b.dtIns <= (SELECT dtStop FROM attivita WHERE idAt = 101)
                AND b.${field} = 1
                AND b.deleted <> 1
            ) AS t
            LEFT JOIN miPiaceB ON t.idBs = miPiaceB.bisogno AND miPiaceB.utente = ${userId}
        `;
    } else {
        // SQL query when anonym is true
        sql = `
            SELECT t.*, idmi AS nlike
            FROM (
                SELECT b.*, a.ambito AS ambitonome, a.valenza
                FROM bisogni AS b
                JOIN ambiti AS a ON b.ambito = a.idAm
                WHERE b.dtIns >= (SELECT dtStart FROM attivita WHERE idAt = 101)
                AND b.dtIns <= (SELECT dtStop FROM attivita WHERE idAt = 101)
                AND b.${field} = 1
                AND b.deleted <> 1
            ) AS t
            LEFT JOIN miPiaceB ON t.idBs = miPiaceB.bisogno AND miPiaceB.utente = ${userId}
        `;
    }

    // Add date range condition for the "valBis" table
    const dateRange = `
        AND miPiaceB.dtIns BETWEEN (SELECT dtStart FROM attivita WHERE idAt = 103)
        AND (SELECT dtStop FROM attivita WHERE idAt = 103)
        ORDER BY t.ambito, t.idBs;
    `;

    try {
        // Execute the SQL query using Sequelize
        const [results] = await sequelize.query(sql + dateRange);

        // Send the results back to the client
        res.json(results);
    } catch (error) {
        console.error('Error fetching posts without grade:', error);
        res.status(500).json({ error: 'Error fetching posts without grade' });
    }
});

router.post('/getLastPollType', async (req, res) => {
    const { idAt } = JSON.parse(req.body.data)  // Extract idAt from the request parameters

    // SQL query to get the ballottaggio for the given idAt where stato is 2
    const sql = `
        SELECT ballottaggio 
        FROM attivita 
        WHERE idAt = :idAt 
        AND stato = 2
    `

    try {
        // Execute the SQL query
        const [result, metadata] = await sequelize.query(sql, {
            replacements: { idAt },
            type: sequelize.QueryTypes.SELECT
        })

        for (const [key, value] of Object.entries(result)) {
            if (JSON.stringify(value).includes('Buffer')) {
                let num = JSON.stringify(value).slice(-3, JSON.stringify(value).length - 2)
                result[key] = parseInt(num)
            }
        }
        console.log(result)
        // Check if any result was returned
        if (result)
            res.json(result)
        else
            res.json(null)
    } catch (error) {
        console.error('Error fetching last poll type:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.post('/getSummaryBis', async (req, res) => {
    const { field } = JSON.parse(req.body.data); // Extract the field from the request body

    // SQL query to get the idBs and titleBis for Bisogni that match the field and aren't deleted
    const sql = `
        SELECT idBs, titleBis 
        FROM bisogni 
        WHERE ${field} = 1 
        AND deleted <> 1
        AND dtIns >= (SELECT dtStart FROM attivita WHERE idAt = 101)
        AND dtIns <= (SELECT dtStop FROM attivita WHERE idAt = 101)
    `;

    try {
        // Execute the SQL query using Sequelize
        const [results] = await sequelize.query(sql);

        // Send the results back to the client
        res.json(results);
    } catch (error) {
        console.error('Error fetching summary of Bisogni:', error);
        res.status(500).json({ error: 'Error fetching summary of Bisogni' });
    }
});

// router.post('/getBisResultPolling', async (req, res) => {
//     const { role, savegrad, field, user_id } = JSON.parse(req.body.data); // Extracting the POST data

//     // SQL query to get the necessary data
//     let sql = `
//         SELECT
//             bisogni.idBs, ambiti.idAm, ambiti.ambito, bisogni.titleBis, bisogni.utente, 
//             bisogni.pubblicato, bisogni.dtRev, bisogni.rev, bisogni.deleted, 
//             bisogni.ingrad, vvll.*
//         FROM
//             bisogni, ambiti,
//             (SELECT biv, grade, votanti, nlike
//              FROM (SELECT bisogni.idBs as biv, sum(grade) as grade, count(grade) as votanti
//                    FROM bisogni
//                    LEFT JOIN valBis ON
//                        bisogni.idBs = valBis.bisogno
//                        AND valBis.dtIns >= (SELECT dtStart FROM attivita WHERE idAt=104)
//                        AND valBis.dtIns <= (SELECT dtStop FROM attivita WHERE idAt=104)
//                    GROUP BY bisogni.idBs) AS vv
//              LEFT JOIN
//                (SELECT bisogni.idBs as bil, count(idmi) as nlike
//                 FROM (bisogni
//                   LEFT JOIN miPiaceB ON
//                   bisogni.idBs = miPiaceB.bisogno
//                   AND miPiaceB.dtIns >= (SELECT dtStart FROM attivita WHERE idAt=104)
//                   AND miPiaceB.dtIns <= (SELECT dtStop FROM attivita WHERE idAt=104))
//                 GROUP BY bisogni.idBs) AS ll
//              ON vv.biv = ll.bil) AS vvll
//         WHERE
//             bisogni.idBs = vvll.biv
//             AND ambiti.idAm = bisogni.ambito
//     `;

//     // Modify SQL based on user role
//     if (role === "personal") {
//         sql += ` AND utente = :user_id ORDER BY grade DESC;`;
//     } else {
//         sql += ` ORDER BY grade DESC, nlike DESC, ambito ASC;`;
//     }

//     try {
//         // Execute the SQL query with Sequelize
//         const [posts, metadata] = await sequelize.query(sql, {
//             replacements: { user_id },
//             type: sequelize.QueryTypes.RAW
//         });

//         if (savegrad) {
//             const gradposts = [];

//             console.log(posts)
//             posts.forEach(post => {
//                 if (!post.deleted && post[field]) {
//                     post.ingrad = 1;
//                     gradposts.push(post);
//                 }
//             });

//             let bal = 0;
//             if (field === "ingrad") {
//                 bal = 1;
//             }

//             // Prepare the SQL for saving the grad list
//             let gradSql = `DELETE FROM gradBisogni WHERE ballot = :bal; INSERT INTO gradBisogni (idBs, IdAm, grade, nlike, votanti, ballot) VALUES `;
//             const coll = [];

//             gradposts.forEach(post => {
//                 const grade = post.grade || 0;
//                 gradSql += `(:idBs, :idAm, :grade, :nlike, :votanti, :bal),`;
//                 coll.push(post.idBs);
//             });

//             gradSql = gradSql.slice(0, -1); // Remove last comma
//             gradSql += `; UPDATE bisogni SET ingrad = 1 WHERE idBs IN (${coll.join(',')})`;

//             console.log()
//             // Execute the grad update SQL
//             await sequelize.query(gradSql, {
//                 replacements: {
//                     bal,
//                     ...gradposts.reduce((acc, post, index) => {
//                         acc[`idBs_${index}`] = post.idBs;
//                         acc[`idAm_${index}`] = post.idAm;
//                         acc[`grade_${index}`] = post.grade || 0;
//                         acc[`nlike_${index}`] = post.nlike;
//                         acc[`votanti_${index}`] = post.votanti;
//                         return acc;
//                     }, {}),
//                 },
//                 type: sequelize.QueryTypes.INSERT
//             });

//             req.session.ini.gradDefBisogni = 1;

//             // Assuming updIniFile is a function that updates session values
//             // updIniFile('Temp', 'gradDefBisogni', 1);

//             if (field === "ingrad") {
//                 req.session.ini.BallottaggioBis = 1;
//                 // updIniFile('Temp', 'BallottaggioBis', 1);
//             }
//         }

//         res.json(posts); // Send the posts back as a JSON response
//     } catch (error) {
//         console.error('Error in /getBisResultPolling route:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.post('/getBisResultPolling', async (req, res) => {
    // Extract the required data from the POST body
    const { role, savegrad, field, user_id } = JSON.parse(req.body.data); // Extract role, savegrad, and field from the request

    // SQL query base
    let sql = `
        SELECT
            bisogni.idBs, ambiti.idAm, ambiti.ambito, bisogni.titleBis, bisogni.utente, 
            bisogni.pubblicato, bisogni.dtRev, bisogni.rev, bisogni.deleted, 
            bisogni.ingrad, vvll.*
        FROM
            bisogni, ambiti,
            (SELECT biv, grade, votanti, nlike
             FROM (SELECT bisogni.idBs as biv, sum(grade) as grade, count(grade) as votanti
                   FROM bisogni
                   LEFT JOIN valBis ON
                       bisogni.idBs = valBis.bisogno
                       AND valBis.dtIns >= (SELECT dtStart FROM attivita WHERE idAt=104)
                       AND valBis.dtIns <= (SELECT dtStop FROM attivita WHERE idAt=104)
                   GROUP BY bisogni.idBs) AS vv
             LEFT JOIN
               (SELECT bisogni.idBs as bil, count(idmi) as nlike
                FROM (bisogni
                  LEFT JOIN miPiaceB ON
                  bisogni.idBs = miPiaceB.bisogno
                  AND miPiaceB.dtIns >= (SELECT dtStart FROM attivita WHERE idAt=104)
                  AND miPiaceB.dtIns <= (SELECT dtStop FROM attivita WHERE idAt=104))
                GROUP BY bisogni.idBs) AS ll
             ON vv.biv = ll.bil) AS vvll
        WHERE
            bisogni.idBs = vvll.biv
            AND ambiti.idAm = bisogni.ambito
    `;

    // Modify the SQL query based on role
    if (role === "personal") {
        sql += ` AND utente = ${user_id} ORDER BY grade DESC;`;
    } else {
        sql += ` ORDER BY grade DESC, nlike DESC, ambito ASC;`;
    }

    try {
        // Execute the initial SQL query
        const [posts, metadata] = await sequelize.query(sql, {
            type: sequelize.QueryTypes.RAW
        });

        if (savegrad) {
            const gradposts = [];
            console.log(posts)
            posts.forEach(post => {
                if (!post.deleted && post[field]) {
                    post.ingrad = 1;
                    gradposts.push(post);
                }
            });

            let bal = 0;
            if (field === "ingrad") {
                bal = 1;
            }

            // Construct the DELETE and INSERT query for gradBisogni
            let gradSql = `DELETE FROM gradBisogni WHERE ballot = ${bal}; INSERT INTO gradBisogni (idBs, IdAm, grade, nlike, votanti, ballot) VALUES `;
            let coll = "(";
            gradposts.forEach(post => {
                const grade = post.grade || 0; // Ensure grade is not null
                gradSql += `(${post.idBs}, ${post.idAm}, ${grade}, ${post.nlike}, ${post.votanti}, ${bal}),`;
                coll += `${post.idBs},`;
            });

            // Remove the trailing comma and complete the SQL
            gradSql = gradSql.slice(0, -1) + ";";
            coll = coll.slice(0, -1) + ")";
            gradSql += ` UPDATE bisogni SET ingrad = 1 WHERE idBs IN ${coll};`;

            // Execute the grad update SQL
            await sequelize.query(gradSql, { type: sequelize.QueryTypes.INSERT });
        }

        // Return the result as JSON
        res.json(posts);
    } catch (error) {
        console.error('Error in /your-endpoint route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router