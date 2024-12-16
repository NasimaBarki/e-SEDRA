'use strict'

// import moduli
const express = require('express')
var sequelize = require('../../sequelize')
const config = require('../../config.json')

// setup router
const router = express.Router()

// query
let query = ''
let type = undefined

if (config.database.dbms == 'My SQL')
    query = `CREATE PROCEDURE setDataUser(vid INT, nomen VARCHAR(30), cognn VARCHAR(30), emailn VARCHAR(30), pswn VARCHAR(255), celln VARCHAR(20), codn VARCHAR(20))
    BEGIN
         IF vid = 0 THEN
           INSERT INTO utenti(nome, cognome, email, psw, cell, cod, dtPsw)
		        VALUES(nomen, cognn, emailn, pswn, celln, codn, now());
        ELSE
            IF vid = 1 THEN
                UPDATE utenti SET cell=celln, cod=codn
		                WHERE idUs=vid;
            ELSE
                UPDATE utenti SET nome=nomen, cognome=cognn, cell=celln, cod=codn
		                WHERE idUs=vid;
            END IF;
        END IF;
    END`

else if (config.database.dbms == 'SQL Server')
    query = `CREATE PROCEDURE setDataUser
        @vid INT,
        @nome VARCHAR(30),
		@cogn VARCHAR(30),
        @email VARCHAR(30),
        @psw VARCHAR(255),
        @cell VARCHAR(20),
        @cod VARCHAR(20)
    AS
        BEGIN
                SET NOCOUNT ON;
                IF @vid = 0 BEGIN
                    INSERT INTO utenti (nome, cognome, email, psw, cell, cod)
		            VALUES(@nome, @cogn, @email, @psw, @cell, @cod);
                END
                ELSE BEGIN
                    if @vid = 1 BEGIN
                        UPDATE utenti SET cell=@cell, cod=@cod
		                WHERE idUs=@vid;
                    END
                    ELSE BEGIN
                        UPDATE utenti SET nome=@nome, cognome=@cogn, cell=@cell, cod=@cod
		                WHERE idUs=@vid;
                    END
                END
        END`

router.post('/spSetDataUser', async (req, res) => {
    await sequelize.query(query, (error, results) => {
        if (error)
            res.send(error)
    })

    res.send('Stored procedure setDataUser creata...')
})

module.exports = router