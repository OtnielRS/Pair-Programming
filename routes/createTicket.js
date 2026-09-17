const express = require('express')
const router = express()
const CreateTicket = require('../controller/createTicket')



// create ticket 

const middleware = function (req, res, next) {
    // console.log(req.session)
    // console.log('masuk sini');
    if(!req.session.user) {
        res.redirect(`/login?error=Please login first`)
    }else{
        next()
    }
}

// history of transaction 
router.get('/profile/:userId', middleware, CreateTicket.profile)

router.get('/add', middleware , CreateTicket.getCreateBooking)
router.post('/add', middleware,  CreateTicket.postCreateBooking)

// pilih pesawat

router.get('/add/plane', middleware, CreateTicket.getPlane)

// konfirmasi
router.get('/add/plane/:id/confirmation', middleware, CreateTicket.getConfirmation)
router.post('/add/plane/:id/confirmation', middleware, CreateTicket.postConfirmation)

// calculation Price
router.get('/calculation/:id', middleware, CreateTicket.priceCalculation)

module.exports = router