const express = require('express')
const { default: mongoose } = require('mongoose')
const userAuth = require('./../models/user')
const router = express.Router()

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.get('/signup', (req, res) => {
    res.render("auth/signup")
})

router.post('/signup', async (req, res) => {

    const userData = {
        username: req.body.username,
        password: req.body.password

    }
    await userAuth.insertMany([userData])
    
})