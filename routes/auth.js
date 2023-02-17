const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth_controller')



router.get('/login', (req, res) => {
    res.render('auth/login')
})    

router.get('/signup', (req, res) => {
    res.render("auth/signup")
})    


module.exports = router