'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')
const configPath = './config.json'
const fs = require('fs')

// setup router
const router = express.Router()

// query
let query = ''
let type = undefined

if (config.database.dbms == 'SQL Server') {
    query = 'SELECT name FROM sys.databases where name=\'' + config.database.name + '\';'

    type = false
}
else if (config.database.dbms == 'My SQL') {
    query = 'SELECT SCHEMA_NAME FROM information_schema.schemata WHERE SCHEMA_NAME=\'' + config.database.name + '\';'

    type = true
}

router.post('/db', async (req, res) => {
    try {
        // se si dichiara che il db esiste non cerco né creo lo schema
        if (config.database.exists == 'true')
            res.send('Database caricato...')
        else {
            // controllo se lo schema esiste
            let [result, metadata] = await sequelize.query(query, {
                ...type && { type: sequelize.QueryTypes.SELECT }
            })

            if (config.database.dbms == 'SQL Server')
                result = result[0]

            // se esiste avviso l'utente
            if (result) {
                res.status(500).send('Un database con nome \'' + config.database.name + '\' è già esistente!')
            }
            else {
                // altrimenti creo il db
                query = 'CREATE DATABASE ' + config.database.name + ';'

                await sequelize.query(query, {
                    ...type && { type: sequelize.QueryTypes.CREATE }
                })

                res.send('Base dati creata...')

                // modifico la connessione di sequelize
                config.database.exists = 'true'
                config.sequelize = 'true'
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = router