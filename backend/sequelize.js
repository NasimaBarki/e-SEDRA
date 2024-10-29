'use strict'

// import
const { Sequelize } = require('sequelize')
const config = require('./config.json')
let sequelize

// init DB
if (config.sequelize == 'true') {
    if (config.database.dbms == 'My SQL') {
        sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
            host: config.database.host,
            dialect: 'mysql',
            dialectOptions: {
                multipleStatements: true
            }
        })
    } else if (config.database.dbms == 'SQL Server') {
        // sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
        //     host: config.database.host,
        //     dialect: 'mssql',
        //     dialectOptions: {
        //         options: {
        //             encrypt: true,
        //             trustServerCertificate: true,
        //             multipleStatements: true,
        //             instanceName: 'SQLEXPRESS'
        //         }
        //     }
        // })

        sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
            host: config.database.host,
            dialect: 'mssql',
            port: 51134,
            dialectOptions: {
                options: {
                    encrypt: true,
                }
            }
        });
    }

    console.log('Creata istanza ', config.database.dbms)
}

module.exports = sequelize