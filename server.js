const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const methodOverride = require('method-override')

const Article = require('./models/article')
const articleRouter = require('./routes/articles')

const { auth, requiresAuth } = require('express-openid-connect');
const User = require('./models/user')

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://ravig31:room14>@<cluster-address>/<database>?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

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
app.listen(3000)
