'use strict';

// import package
const express = require('express');

// crea app
const app = express();

// porta
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// attivazione server
app.listen(port, () => {
    console.log(`Server in ascolto alla porta ${port}`)
})