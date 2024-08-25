'use strict';

const bcrypt = require('bcrypt');
const db = new sqlite.Database('./database.db', (err) => {
    if (err) throw err;
});

exports.getUserById = function (idUs) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utenti WHERE idUs = ?';
        db.get(sql, [idUs], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'Utente non trovato.' });
            else {
                const user = {
                    idUs: row.idUs,
                    nome: row.nome,
                    cognome: row.cognome,
                    email: row.email,
                    psw: row.psw,
                    dtPsw: row.dtPsw,
                    cell: row.cell,
                    cod: row.cod,
                    menuAct: row.menuAct
                }
                resolve(user);
            }
        });
    });
};

exports.getUser = function (email, psw) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utenti WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = {
                    idUs: row.idUs,
                    nome: row.nome,
                    cognome: row.cognome,
                    email: row.email,
                    psw: row.psw,
                    dtPsw: row.dtPsw,
                    cell: row.cell,
                    cod: row.cod,
                    menuAct: row.menuAct
                };
                let check = false;

                if (bcrypt.compareSync(psw, row.psw))
                    check = true;

                resolve({ user, check });
            }
        });
    });
};