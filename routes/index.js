const express = require('express');
const router = express()
const port = 3000;
const userPages = require('./userPages.js')
const booking = require('./createTicket.js')



router.use('/', userPages)
router.use('/booking', booking)



module.exports = router


