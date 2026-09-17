const express = require('express')
const router = express()
const UserController = require('../controller/UserController')



router.get('/', UserController.homePage)


//LOgin (GEt and POST)
router.get('/login', UserController.getLoginPage)
router.post('/login', UserController.postLoginPage)


// Registration User Profil(GET and Post)
router.get('/registrationProfiles', UserController.getRegisterPage)
router.post('/registrationProfiles', UserController.postRegisterPage)

// logout
router.get("/logout", UserController.logout)

// Registration User Id
// router.get('/registrationId', UserController.getRegisterPageId)
// router.post('/registrationId', UserController.postRegisterPageId)

module.exports = router