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

router.post('/getstelle', async (req, res) => {
    const campo = req.body.campo
    const sql = 'SELECT idstar,' + campo + ' FROM numberOfStars;'

    const [results, metadata] = await sequelize.query(sql, { type: sequelize.QueryTypes.RAW })

    res.json(results)
})

module.exports = router