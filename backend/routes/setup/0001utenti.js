'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')

// hash password
const bcrypt = require('bcrypt')
const salt = 10

// setup router
const router = express.Router()

// query
let resume = ''
let autoinc = ''
let dtNow = ''
let dtInsert = ''
let pswAdm = config.database.passwordAdmin
let queryInsert = ''

bcrypt.genSalt(salt, function (err, salt) {
    bcrypt.hash(pswAdm, salt, function (err, hash) {
        queryInsert = `INSERT INTO utenti (nome, cognome, email, psw, dtPsw) VALUES \
    (' ', 'Admin', '` + config.database.mailAdmin + `', '` + hash + `', ` + dtInsert + `);`

    })
})

if (config.database.dbms == 'My SQL') {
    autoinc = 'AUTO_INCREMENT'
    dtNow = 'DEFAULT NULL'
    dtInsert = 'now()'
}

else if (config.database.dbms == 'SQL Server') {
    autoinc = 'IDENTITY(1,1)'
    dtNow = 'DEFAULT getdate() NOT NULL'
    dtInsert = 'getdate()'
}

let query = `CREATE TABLE utenti ( \
    idUs    INT ` + autoinc + ` NOT NULL PRIMARY KEY, \
    nome    VARCHAR(40)  NOT NULL, \
    cognome VARCHAR(40)  NOT NULL, \
    email   VARCHAR(60)  NOT NULL UNIQUE, \
    psw     VARCHAR(255) NOT NULL, \
    dtPsw   DATETIME ` + dtNow + `, \
    cell    VARCHAR(20), \
    cod     VARCHAR(20), \
    menuAct TINYINT DEFAULT 0 \
);`

router.post('/utenti', async (req, res) => {
    if (config.resume != '0') {
        resume = 'DROP TABLE IF EXISTS utenti'
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

        res.send('Table utenti creata')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router