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

let query = `CREATE TABLE numberOfStars
(
	idstar INT NOT NULL PRIMARY KEY,
	vbis INT DEFAULT 1,
    vpro INT DEFAULT 1
);
INSERT INTO numberOfStars (idstar) VALUES
    (1),(2),(3),(4),(5),
    (6),(7),(8),(9),(10);`

router.post('/numberOfStars', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS numberOfStars'
    }

    try {
        if (resume) {
            await sequelize.query(resume, {
                type: sequelize.QueryTypes.DROP
            })
        }

        await sequelize.query(query)

        res.send('Table numberOfStars creata...')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post('/updValBis', async (req, res) => {
    console.log(req.body)
    const { idBis, val, idUs } = req.body;  // Retrieve values from the request body

    // Prepare the SQL query to call the stored procedure
    const sql = `CALL updValBis(:idBis, :idUs, :val)`;

    try {
        // Execute the stored procedure using Sequelize
        await sequelize.query(sql, {
            replacements: {
                idBis: parseInt(idBis),
                idUs: parseInt(idUs),  // Retrieve the user ID from the session
                val: parseInt(val)
            }  // Use SELECT to handle non-SELECT queries
        })

        // Return the value in the response as done in PHP
        res.json({ val });
    } catch (error) {
        console.error('Error executing procedure:', error);
        res.status(500).json({ error: 'Error executing stored procedure' });
    }
});

router.post('/chkvalut', async (req, res) => {
    let body
    if (req.body.data)
        body = JSON.parse(req.body.data)
    else
        body = req.body

    console.log('body ', body)
    const act = body.idAct
    const userId = body.idUs // Assuming user session has idUs

    let chkVal = {}

    try {
        // Step 1: Get activity configuration (getActConf equivalent)
        const actConfResult = await sequelize.query(
            'CALL getActConf(:idAct)',
            { replacements: { idAct: act }, type: sequelize.QueryTypes.SELECT }
        )

        const tipoVal = actConfResult[0][0].altridati

        // console.log('tipoval ', actConfResult[0][0])

        // Step 2: If activity uses ranking (tipoVal = 1), get max stars (getMaxStar equivalent)
        if (tipoVal === 1) {
            const [maxStarsResult, metadata] = await sequelize.query(
                'CALL getMaxStar(:idAct)',
                { replacements: { idAct: act }, type: sequelize.QueryTypes.SELECT }
            )

            // console.log('maxStars ', maxStarsResult)

            for (const [key, value] of Object.entries(maxStarsResult)) {
                chkVal[value.idStar] = [value.maxStar, 0]  // Set [maxStar, 0] for each grade
            }

            // Initialize chkVal with max stars from the result
            // maxStarsResult.forEach(row => {
            //     chkVal[row.idStar] = [row.maxStar, 0]  // Set [maxStar, 0] for each grade
            // })
            // console.log(chkVal)

        } else {
            // Default to 10 stars with max value of 1024
            for (let i = 1; i <= 10; i++) {
                chkVal[i] = [1024, 0]  // Set default [1024, 0] for grades 1-10
            }
        }

        // Step 3: Get the number of votes (getNroVoti equivalent)
        const [votesResult, metadata] = await sequelize.query(
            'CALL getNroVoti(:idAct, :idUs)',
            { replacements: { idAct: act, idUs: userId }, type: sequelize.QueryTypes.SELECT }
        )

        for (const [key, value] of Object.entries(votesResult)) {
            chkVal[value.idStar] = [value.maxStar, 0]
            // Set [maxStar, 0] for each grade
            if (chkVal[value.grade]) {
                chkVal[value.grade][1] = value.tot  // Update the total votes (index 1) for the grade
            }
        }
        // Add the total votes for each grade to chkVal
        // votesResult.forEach(row => {
        //     const grade = row.grade  // Grade from the result
        //     const total = row.tot   // Total votes for that grade

        //     if (chkVal[grade]) {
        //         chkVal[grade][1] = total  // Update the total votes (index 1) for the grade
        //     }
        // })

        // Step 4: Return the result as JSON
        res.json(chkVal)
    } catch (error) {
        console.error(error)
        res.sendStatus(500) // Return a 500 status on error
    }
})

router.post('/getstelle', async (req, res) => {
    const campo = req.body.campo
    const sql = 'SELECT idstar,' + campo + ' FROM numberOfStars;'

    const [results, metadata] = await sequelize.query(sql, { type: sequelize.QueryTypes.RAW })

    res.json(results)
})

module.exports = router