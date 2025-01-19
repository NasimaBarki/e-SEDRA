'use strict'

// import moduli
const express = require('express')
var sequelize = require('../sequelize')
const bcrypt = require('bcrypt')
const roles = require('../js/utilfunctions')
const formData = require('express-form-data')
const nodemailer = require('nodemailer')

// file di configurazione
const configPath = './config.json'
const config = require('../config.json')

// query
let query = ''
let type = undefined

// setup router
const router = express.Router()
router.use(formData.parse())

router.post('/login', async (req, res) => {
    let body = req.body
    let scPsw = config.scPsw

    try {
        if (config.database.dbms == 'SQL Server') {

            query = 'Login @email=\'' + body.EMAIL + '\', @scPsw=' + scPsw + ';'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL Login(:usn, :scPsw)'

            type = true
        }

        let results = await sequelize.query(query, {
            ...type && { replacements: { usn: body.EMAIL, scPsw: scPsw } },
            ...type && { type: sequelize.QueryTypes.SELECT }
        })

        const match = await bcrypt.compare(body.PSW, results[0][0].psw)

        //console.log(results)

        if (config.database.dbms == 'SQL Server') {
            let primoArray = results[0][0]
            let secondoArray = results[0][1]

            results = []
            results.push(primoArray)
            results.push(secondoArray)
        }

        let user = undefined
        if (results != 0 && match) {
            if (config.database.dbms == 'SQL Server') {
                // console.log('results: ', results)

                user = results[0]
                user['nome'] = results[1]['nome']
                user['cognome'] = results[1]['cognome']
                user['cell'] = results[1]['cell']
                user['cod'] = results[1]['cod']
                user['menuAct'] = results[1]['menuAct']
                user['dtPsw'] = results[1]['dtPsw']
                user['ggScPsw'] = results[1]['ggScPsw']

                user.roles = {}

                let results1 = []
                console.log('Results1: ', results[1])

                user["R"] = 'K'

                console.log('user: ', user)
                res.send(user)
            } else {
                results.pop()

                //console.log(results)
                let results1 = []

                for (let i = 0; i < Object.keys(results[1]).length; i++) {
                    results1.push(results[1][i])
                }

                // console.log('results1: ', results1)

                let userProva = null;

                if (results1.length >= 1) {
                    // Assign the first result to userProva
                    userProva = { ...results1[0] };

                    // Remove unnecessary properties
                    delete userProva.psw;
                    delete userProva.ruolo;
                    delete userProva.ruoloNU;
                    delete userProva.subruolo;
                    delete userProva.subruoloNU;

                    // Initialize the roles object
                    userProva.roles = {};

                    // Iterate through results1 to populate roles
                    for (const r of results1) {
                        // Ensure the roleNU key exists in roles
                        if (!userProva.roles[r.ruoloNU]) {
                            userProva.roles[r.ruoloNU] = {};
                        }

                        // Set the role's name
                        userProva.roles[r.ruoloNU].nome = r.ruolo;

                        // If a sub-role exists, add it under the corresponding role
                        if (r.subruoloNU != null) {
                            userProva.roles[r.ruoloNU][r.subruoloNU] = r.subruolo;
                        }
                    }

                    // Log the final userProva object
                    // console.log(userProva);
                }


                user = roles.rolesToString(results1, 'idUs')
                user = user[0]

                delete user.psw
                delete user.ruoloNU
                delete user.subruolo
                delete user.subruoloNU

                let results0 = [results[0]['0']]
                user.dtStart = results0[0].dtStart
                user.ggScPsw = results0[0].ggScPsw

                user["R"] = 'K'
                user.roles = userProva.roles
            }
            // console.log('user: ', user)
            res.send(user)
        }

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ 'R': 'X' })
    }
})

function genToken(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charsLength = chars.length;
    let token = '';

    // Generate a random token based on the chars string and the desired length
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsLength);  // Secure random index
        token += chars[randomIndex];
    }

    return token;
}

// Function to send the token via email (using nodemailer)
async function sendTokenMail(token, email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.database.mailAdmin,
            pass: config.database.passwordAdmin,
        },
    });

    const mailOptions = {
        from: config.database.mailAdmin,
        to: email,
        subject: 'Your Token',
        text: `Here is your token: ${token}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

router.post('/chktoken', async (req, res) => {
    const { TOKEN, NEWPSW } = req.body;

    if (!TOKEN || !NEWPSW) {
        return res.status(400).json({ error: 'Token and New Password are required' });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(NEWPSW, 10);

        // Call stored procedure to change the password
        const sql = 'CALL chgPswWithToken(:token, :newPsw)';
        const [result] = await sequelize.query(sql, {
            replacements: { token: TOKEN, newPsw: hashedPassword },
            type: sequelize.QueryTypes.SELECT
        });

        if (result && result.length > 0) {
            return res.json({ message: 'Password changed successfully' });
        } else {
            return res.status(400).json({ error: 'Error executing password change procedure' });
        }
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Define the '/chkreqtoken' route
router.post('/chkreqtoken', async (req, res) => {
    const { EMAIL } = req.body;

    if (!EMAIL) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // SQL query to call the stored procedure (adapt for Sequelize or raw query)
    const token = genToken();
    const exp = 0; // You can modify this value based on your requirements (was previously `$_SESSION['ini']['scTkn']`)

    try {
        const result = await sequelize.query('CALL reqToken(:usn, :token, :exp)', {
            replacements: { usn: EMAIL, token, exp },
            type: sequelize.QueryTypes.SELECT,
        });

        if (result && result.length > 0) {
            // Sending token email
            const emailSent = await sendTokenMail(token, EMAIL);

            if (emailSent) {
                res.json({ token: 'Token sent successfully' });
            } else {
                res.status(500).json({ error: 'Error sending token email' });
            }
        } else {
            res.status(400).json({ error: 'Error executing procedure' });
        }
    } catch (error) {
        console.error('Error executing procedure or sending email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/chkloglogin', async (req, res) => {
    let user = req.body

    try {
        if (config.database.dbms == 'SQL Server') {

            query = 'setLogLogin @idUsr=\'' + user.idUs + '\', @dtLog=' + user.dtStart + ', @delLog=' + config.delLog + ';'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL setLogLogin(:idUsr, :dtLog, :delLog)'

            type = true
        }

        await sequelize.query(query, {
            ...type && { replacements: { idUsr: user.idUs, dtLog: user.dtStart, delLog: config.delLog } },
            ...type && { type: sequelize.QueryTypes.INSERT }
        })

        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).send('Impossibile fare il logout')
    }
})

router.post('/logout', async (req, res) => {
    let body = JSON.parse(req.body.data)

    console.log(body)

    try {
        if (config.database.dbms == 'SQL Server') {

            query = 'setLogLogout @idUsr=\'' + body.idUs + '\', @dtLog=' + body.dtStart + ';'

            type = false
        }
        else if (config.database.dbms == 'My SQL') {
            query = 'CALL setLogLogout(:idUsr, :dtLog)'

            type = true
        }

        await sequelize.query(query, {
            ...type && { replacements: { idUsr: body.idUs, dtLog: body.dtStart } },
            ...type && { type: sequelize.QueryTypes.UPDATE }
        })

        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).send('Impossibile fare il logout')
    }
})

module.exports = router