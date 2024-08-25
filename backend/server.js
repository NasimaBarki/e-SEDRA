'use strict';

// import
const express = require('express');
const topicDao = require('./dao/topicDao.js');

// crea app
const app = express();
var cors = require('cors');
app.use(cors());

// porta
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// ottieni topics
app.get('/topics', (req, res) => {
    console.log('GET TOPICS')
    topicDao.getAllTopics()
        .then((topics) => res.json(topics))
        .catch(() => res.status(500).end());
})

// attivazione server
app.listen(port, () => {
    console.log(`Server in ascolto alla porta ${port}`)
})