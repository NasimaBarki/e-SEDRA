'use strict'

// import moduli
const express = require('express')

// setup router
const router = express.Router()

router.post('/logerror', (req, res) => {
    res.sendStatus(200)
})

module.exports = router