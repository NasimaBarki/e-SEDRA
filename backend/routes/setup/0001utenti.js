'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')
const formData = require('express-form-data') // ora dal client posso mandare form data
const fs = require('fs')
const { parse } = require('csv-parse')

// hash password
const bcrypt = require('bcrypt')
const salt = 10

// setup router
const router = express.Router()

router.use(formData.parse())

// query
let resume = ''
let autoinc = ''
let dtNow = ''
let dtInsert = ''
let pswAdm = config.database.passwordAdmin
let queryInsert = ''
let sql = ''
let type = undefined

// funzioni utenti
async function set_ruolo_utente(utente, ruolo, subr) {
    try {
        if (config.database.dbms == 'SQL Server') {
            sql = 'EXEC setDataUser @vid="' + vid + '", @n="'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            sql = "CALL setRoleUser(:how,:role, :sub)"

            type = true
        }

        const [results, metadata] = await sequelize.query(sql, {
            ...type && { replacements: { how: utente, role: ruolo, sub: subr } },
            ...type && { type: sequelize.QueryTypes.UPDATE }
        })

        console.log(results)
    } catch (error) {
        return 'Errore query SetRoleUser'
    }
}

async function set_User(vid, dcsv, psw = null) {
    try {
        let up = true

        if (vid == 0) {
            up = false;
            let pswTemp = (dcsv['nome'][0] + dcsv['cognome'][0]).toLowerCase();
            psw = await bcrypt.hash(pswTemp, 10)
        }

        if (config.database.dbms == 'SQL Server') {
            sql = 'EXEC setDataUser @vid="' + vid + '", @n="'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            sql = "CALL setDataUser(:vid, :n, :c, :em, :ps, :cel, :cod)"

            type = true
        }

        let cell = null;
        let cod = null;

        let no = dcsv["nome"];
        let cg = dcsv["cognome"];
        let em = ''

        if (!up)
            em = dcsv["email"];
        else em = "non usata";
        if (dcsv['cell'] !== undefined)
            cell = dcsv["cell"];
        if (dcsv['cod'] !== undefined)
            cod = dcsv["cod"];

        await sequelize.query(sql, {
            ...type && { replacements: { vid: vid, n: no, c: cg, em: em, ps: psw, cel: cell, cod: cod } },
            ...type && { type: sequelize.QueryTypes.INSERT }
        })

        if (up)
            return vid;
        else {
            sql = "SELECT max(idUs) as lastid FROM utenti;"
            const [results, metadata] = await sequelize.query(sql, {
                ...type && { type: sequelize.QueryTypes.SELECT }
            })

            return results['lastid'];
        }
    } catch (error) {
        console.log(error)
        return 'Errore query SetDataUser'
    }
}

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

async function setUser(user) {
    if (config.database.dbms == 'SQL Server') {
        sql = 'CALL setDataUser(:vid, :n, :c, :em, :ps, :cel, :cod)'

        type = false
    }
    else if (config.database.dbms == 'My SQL') {
        sql = 'CALL setDataUser(:vid, :n, :c, :em, :ps, :cel, :cod)'

        type = true
    }
    let cell = null
    let cod = null
    let psw = user.nome.toLowerCase() + user.cognome.toLowerCase()

    bcrypt.genSalt(salt, function (err, salt) {
        bcrypt.hash(psw, salt, function (err, hash) {
            psw = hash
        })
    })

    if (user.hasOwnProperty('cell'))
        cell = user.cell
    if (user.hasOwnProperty('cod'))
        cod = user.cod

    try {
        await sequelize.query(sql, {
            ...type && { replacements: { vid: 0, n: user.nome, c: user.cognome, em: user.email, ps: psw, cel: cell, cod: cod } },
            ...type && { type: sequelize.QueryTypes.INSERT }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query setDataUser')
    }

    sql = 'SELECT max(idUs) as lastid FROM utenti;'

    if (config.database.dbms == 'SQL Server') {
        type = false
    }
    else if (config.database.dbms == 'My SQL') {
        type = true
    }

    try {
        const [result, metadata] = await sequelize.query(sql, {
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        return result.lastid
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query get last user Id')
    }
}

router.post('/impu', (req, res) => {
    let body = req.body
    let file = req.files
    let totRows = 0
    let output = {}
    let errors = []

    fs.readFile(file.fileup.path, async function (err, fileData) {
        parse(fileData, { columns: true, trim: true, delimiter: ';' }, async function (err, rows) {
            totRows = rows.length
            for (let i = 0; i < rows.length; i++) {
                // console.log('Key: ', key)
                // console.log('Value: ', rows[i][key])
                if (config.database.dbms == 'SQL Server') {
                    query = 'CALL getDupMail(:how)'

                    type = false
                }
                else if (config.database.dbms == 'My SQL') {
                    query = 'CALL getDupMail(:how)'

                    type = true
                }

                const [result, metadata] = await sequelize.query(query, {
                    ...type && { replacements: { how: rows[i].email } },
                    ...type && { type: sequelize.QueryTypes.SELECT }
                })


                if (rows[i].hasOwnProperty('nome') == false || rows[i].hasOwnProperty('cognome') == false || rows[i].hasOwnProperty('email') == false) {
                    totRows--
                    errors.push('Riga ' + i + ' scartata: dati mancanti')
                }
                else {
                    if (Object.keys(result).length > 0) {
                        errors.push('(' + i + ')' + rows[i].email + ' duplicata')
                        totRows--
                    }
                    else {
                        let id = await setUser(rows[i])
                        set_ruolo_utente(id, body.Irprim, 0)
                    }
                }
            }

            if (file.fileup.originalFilename.length > 100)
                errors.push('Nome file troppo lungo')
            if (file.fileup.originalFilename == '')
                errors.push('Nessun file selezionato')

            if (errors > 0)
                output['errors'] = errors
            else
                output['success'] = 'Importati ' + totRows + ' utenti.'

            console.log(errors)
            res.json(output)
        })
    })
})

async function dupMail(email) {
    if (config.database.dbms == 'SQL Server') {
        query = 'CALL getDupMail(:how)'

        type = false
    }
    else if (config.database.dbms == 'My SQL') {
        query = 'CALL getDupMail(:how)'

        type = true
    }

    try {
        const [result, metadata] = await sequelize.query(query, {
            ...type && { replacements: { how: email } },
            ...type && { type: sequelize.QueryTypes.SELECT }
        })
        if (Object.keys(result).length > 0)
            return true
        return false
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Errore query delRolesUser')
    }
}

async function delete_ruoli_utente(utente) {
    if (config.database.dbms == 'SQL Server') {
        query = 'CALL delRolesUser(:how)'

        type = false
    }
    else if (config.database.dbms == 'My SQL') {
        query = 'CALL delRolesUser(:how)'

        type = true
    }
    try {
        await sequelize.query(query, {
            ...type && { replacements: { how: user } },
            ...type && { type: sequelize.QueryTypes.DELETE }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query delRolesUser')
    }

}

router.post('/addu', async (req, res) => {
    let datu = {}
    datu = req.body

    for (let [key, value] of Object.entries(datu)) {
        datu[key] = datu[key].replaceAll(' ', '')
    }

    if (!datu['nome'] && !datu['cognome'] && datu['user_id'] == 1) {
        datu['nome'] = ''
        datu['cognome'] = 'Admin'
    }

    let output = {}
    let errors = []
    let succ = []
    let email = null

    if (datu['email'])
        email = datu['email']

    if (!/^[A-Za-z \'-]+$/i.test(datu['nome']) && datu['user_id'] != 1)
        errors.push({ param: 'nome', msg: 'Formato non valido per il nome' })

    if (!/^[A-Za-z \'-]+$/i.test(datu['cognome']) && datu['user_id'] != 1)
        errors.push({ param: 'cognome', msg: 'Formato non valido per il cognome' })

    if (!email && datu['user_id'] == 0)
        errors.push({ param: 'e-mail', msg: 'Campo obbligatorio per i nuovi utenti' })
    else {
        if (!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errors.push({ param: 'e-mail', msg: 'Formato non valido per il e-email' })
    }

    if (await dupMail(email))
        errors.push({ param: 'e-mail', msg: 'L\'email è già stata usata da un altro utente' })

    if (datu['cell'] != '' && !/3\d{2}[\. ]??\d{6,7}$/.test(datu['cell']))
        errors.push({ param: 'cell', msg: 'Formato non valido per il numero di telefono' })

    if (errors.length > 0)
        output['errors'] = errors
    else {
        let id = null
        if (datu['user_id'] != 0) {
            id = set_User(datu['user_id'], datu, null)

            await delete_ruoli_utente(id)
            let ruoli = JSON.parse(datu['ruoli'])

            for (let i = 0; i < ruoli.length; i += 2)
                set_ruolo_utente(id, ruoli[i], ruoli[i + 1])

            // TODO: non so come aggiornare l'utente

            succ.push('Aggiornato utente ID= ' + id)
        } else {
            id = await set_User(0, datu, null)
            let ruoli = JSON.parse(datu['ruoli'])

            for (let i = 0; i < ruoli.length; i += 2)
                set_ruolo_utente(id, ruoli[i], ruoli[i + 1])

            succ.push('Creato utente ID= ' + id)
        }
        succ.push(id)
        succ.push(datu['cognome'][0])
        output['success'] = succ
    }

    console.log(output)
    res.json(output)
})

router.post('/deleteUser', async (req, res) => {
    try {
        let ut = req.body
        if (config.database.dbms == 'SQL Server') {
            query = 'CALL delDataUser(:how)'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL delDataUser(:how)'

            type = true
        }

        await sequelize.query(query, {
            ...type && { replacements: { how: ut.user_id } },
            ...type && { type: sequelize.QueryTypes.DELETE }
        })

        res.json('Utente ' + ut.user_id + ' cancellato!')
    } catch (error) {
        console.log(error)
        res.status(500).send('Errore query delDataUser')
    }
})

module.exports = router