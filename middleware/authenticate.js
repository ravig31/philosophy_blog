const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
    console.log(req.headers)
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decode = jwt.verify(token, 'verySecretValue')

        req.user = decode
        next()

    } catch(err) {
        res.json({
            message: "authentication failed"
        })
    }
}


module.exports = authenticateToken

// function authenticateToken(req, res, next) {
//     console.log(req.headers)
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401)

//     jwt.verify(token, 'verySecretValue', (err, user) => {
//         if (err) return sendStatus(403)
//         req.user = user
//         next()
//     })
// }
