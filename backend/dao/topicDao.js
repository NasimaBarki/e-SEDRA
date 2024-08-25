'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('./database.db', (err) => {
    if (err) throw err;
});

// ottieni tutti i topic
exports.getAllTopics = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM ambiti';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const topics = rows.map((topic) => ({ idAm: topic.idAm, ambito: topic.ambito, valenza: topic.valenza, moreinfo: topic.moreinfo }));
            resolve(topics);
        });
    });
};