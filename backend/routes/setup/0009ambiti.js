'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')

// setup router
const router = express.Router()

// query
let resume = ''
let autoinc = ''
let type = undefined
let queryInsert = `INSERT INTO ambiti (ambito, valenza, moreinfo) VALUES
    ('Regolamento', 12,0),('Problemi', 11,0), ('Ambiente', 10,0),('Attività', 9,0),
    ('Progetti', 8,0), ('Organizzazione della Scuola', 7,0),
    ('Temi da trattare', 6,0), ('Iniziative', 5,0), ('Integrazione o corsi', 4,0),
    ('Idee per la Consulta', 3,0), ('Idee extrascolastiche', 2,0),
    ('Idee per il proprio corso', 1,1), ('Altro', 0,1)`

if (config.database.dbms == 'My SQL')
    autoinc = 'AUTO_INCREMENT'
else if (config.database.dbms == 'SQL Server')
    autoinc = 'IDENTITY(1,1)'

let query = `CREATE TABLE ambiti \
        ( \
            idAm INT NOT NULL ${autoinc} PRIMARY KEY, \
            ambito VARCHAR(40) NOT NULL, \
            valenza INT DEFAULT 0, \
            moreinfo TINYINT NOT NULL \
        )`

router.post('/ambiti', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS ambiti'
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

        res.send('Table ambiti creata')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.get('/ambiti', async (req, res) => {

    try {
        if (config.database.dbms == 'SQL Server') {
            query = 'EXEC getAmbiti'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL getAmbiti'

            type = true
        }

        const [results, metadata] = await sequelize.query(query, {
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        if (results) {
            res.json(results)
        } else {
            res.json(null)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query getAmbiti')
    }
})

router.post('/ambiti/crud', async (req, res) => {
    let errors = []
    let output = {}

    let topic = req.body

    console.log(topic)

    // se l'ambito è vuoto
    if (topic.ambito == '')
        errors.push('Manca il nome per l\'ambito')

    else {
        // creazione ambito
        if (topic.crud == 'C') {
            try {
                if (config.database.dbms == 'SQL Server') {
                    query = 'srcAmbiti @idAm=0, @Ambito=\'' + topic.ambito + '\', @valenza=-1'

                    type = false
                }
                else if (config.database.dbms == 'My SQL') {
                    query = 'CALL srcAmbiti(:how,:name, :valz)'

                    type = true
                }

                const [results, metadata] = await sequelize.query(query, {
                    ...type && { replacements: { how: 0, name: topic.ambito, valz: -1 } },
                    ...type && { type: sequelize.QueryTypes.SELECT }
                })

                if (results > 0)
                    errors.push('Ambito esistente')
            } catch (error) {
                errors.push('Errore query search ambito per nome')
            }
        }
        // se non ci sono errori oppure si vuole aggiornare un ambito
        if (errors.length == 0 || topic.crud == 'U') {
            if (topic.crud == 'C')
                topic.idAm = 0

            try {

                if (config.database.dbms == 'SQL Server') {
                    query = 'updAmbiti \
                    @crud=\'' + topic.crud + '\', \
                    @idAm=\'' + topic.idAm + '\', \
                    @Ambito=\'' + topic.ambito + '\', \
                    @valenza=\'' + topic.valenza + '\', \
                    @ck = \'' + topic.moreinfo + '\''

                    type = false
                }
                else if (config.database.dbms == 'My SQL') {
                    query = 'CALL updAmbiti(:crud,:how,:name, :valz, :morei)'

                    type = true
                }

                if (topic.crud == 'C') {
                    await sequelize.query(query, {
                        ...type && { replacements: { crud: topic.crud, how: topic.idAm, name: topic.ambito, valz: topic.valenza, morei: topic.moreinfo } },
                        ...type && { type: sequelize.QueryTypes.INSERT }
                    })
                }
                else if (topic.crud == 'U') {
                    await sequelize.query(query, {
                        ...type && { replacements: { crud: topic.crud, how: topic.idAm, name: topic.ambito, valz: topic.valenza, morei: topic.moreinfo } },
                        ...type && { type: sequelize.QueryTypes.UPDATE }
                    })
                }

                if (topic.crud == 'C')
                    output['success'] = 'Nuovo ambito creato'
                else
                    output['success'] = 'Ambito aggiornato con successo'

                return res.status(200).json(output)

            } catch (error) {
                errors.push('Errore query aggiorna ambito')
            }
        }
    }

    if (errors)
        output['errors'] = errors

    console.log(output)

    return res.json(output)
})

router.delete('/ambiti', async (req, res) => {
    let topic = req.body

    query = 'CALL updAmbiti(:crud,:how,:name, :valz, :ck)'

    let output = {}

    try {
        if (config.database.dbms == 'SQL Server') {
            query = 'updAmbiti \
                    @crud=\'D\', \
                    @idAm=\'' + topic.idAm + '\', \
                    @Ambito=\'\', \
                    @valenza=\'0\', \
                    @ck = \'0\''

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL updAmbiti(:crud,:how,:name, :valz, :morei)'

            type = true
        }

        await sequelize.query(query, {
            ...type && { replacements: { crud: 'D', how: topic.idAm, name: '', valz: 0, morei: 0, ck: 0 } },
            ...type && { type: sequelize.QueryTypes.DELETE }
        })

        output['success'] = 'Ambito cancellato'
    } catch (error) {
        console.log('Errore: ', error)
        output['errors'] = 'Errore query cancella ambito'
    }

    res.json(output)
})

router.post('/ambiti/search', async (req, res) => {
    let topic = req.body

    try {
        if (config.database.dbms == 'SQL Server') {
            query = 'srcAmbiti @idAm=\'' + topic.idAm + '\', @Ambito=\'' + topic.ambito + '\', @valenza=-1'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL srcAmbiti(:how,:name, :valz)'

            type = true
        }

        const [results, metadata] = await sequelize.query(query, {
            ...type && { replacements: { how: topic.idAm, name: '', valz: -1 } },
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        if (results)
            res.json(results[0])
    } catch (error) {
        console.log('Errore: ', error)
        res.json('Errore query search ambito per nome')
    }
})

module.exports = router