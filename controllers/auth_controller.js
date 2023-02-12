const User = require('../models/user') 
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err){
            res.json({
                error: err
            })
        }
        let user = new User ({
            email: req.body.email,
            username: req.body.username,
            password: hashedPass
        })
    
        user.save().then(user => {
            res.json({
                message: "User successfully added"
            })
        })
        .catch(error => {
            res.json({
                message: "An error occurred!"
            })
        })
    
    })
}

const login = (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    User.findOne({email: username}).then(user =>{
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(err) {
                    res.json({
                        error: err
                    })
                }
                if(result){
                    let token = jwt.sign({name: user.name}, 'verySecretValue', {expiresIn: '1h'})
                    res.json({
                        message: "login success",
                        token
                    })
                }else{
                    res.json({
                        message: "password not match"
                    })
                }
            })
        }else{
            res.json({
                message: "No user found."
            })
        }
    })
}

module.exports = {
    register, login
}