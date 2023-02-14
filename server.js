const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const methodOverride = require('method-override')

const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const authRouter = require('./routes/auth')

const mongoose = require('mongoose')
const { auth, requiresAuth } = require('express-openid-connect');
const user = require('./models/user')


const DB_URL = "mongodb://127.0.0.1:27017/blogposts"
mongoose.set('strictQuery', true);
mongoose.connect(DB_URL);

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: 'http://localhost:3000',
    clientID: 'EqADCxdfNyty9yNdLwydqTbi2ku1dwpN',
    issuerBaseURL: 'https://dev-3w13u2voxkka7vrf.us.auth0.com'
  };

app.use(auth(config))
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(express.json())
app.set('view engine', 'ejs')


app.get('/', async (req, res) => {
    const isLoggedIn = req.oidc.isAuthenticated()
    isLoggedIn ? userImgUrl = req.oidc.user.picture : userImgUrl = null

    const articles = await Article.find().sort({
        createdAt: 'desc'})
    res.render('articles/index', { articles: articles, isLoggedIn: isLoggedIn, userImgUrl: userImgUrl })

})

app.get('/auth/user', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user))
})



app.use("/articles", articleRouter)
app.use("/auth", authRouter)
app.listen(3000)
