const express = require('express')
const app = express()
const router = express.Router()
const dotenv = require('dotenv').config()
const methodOverride = require('method-override')

const Article = require('./models/article')
const User = require('./models/user')
const articleRouter = require('./routes/articles')

const { auth, requiresAuth } = require('express-openid-connect');

const mongoose = require('mongoose')
const DB_URL = "mongodb+srv://ravig31:"+process.env.MONGODB_PASSWORD+"@personal-project-cluste.tscxyk2.mongodb.net/blogposts"
mongoose.set('strictQuery', true);
mongoose.connect(DB_URL);




const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: 'https://prokopton-circle.onrender.com/',
    clientID: 'EqADCxdfNyty9yNdLwydqTbi2ku1dwpN',
    issuerBaseURL: 'https://dev-3w13u2voxkka7vrf.us.auth0.com'
  };

app.use(auth(config))
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(express.json())
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
        
    let sub;
    let userId;
    let userImgUrl;

    const articles = await Article.find().sort({
        createdAt: 'desc'
    })

    if (req.oidc.isAuthenticated()) {
        sub = req.oidc.user.sub.split('|')
        userId = sub[sub.length - 1]

        for (const article of articles) {
            // check if the current user has an article with the same ID as the current article
                if (article.author[0] === userId) {
                    article.isOwnedByCurrentUser = true
                }
            }

        user =  await User.findOne({userId})
        userImgUrl = user.toObject().picture
    }

    




    res.render('articles/index', {
        articles: articles,
        isLoggedIn: req.oidc.isAuthenticated(),
        userImgUrl: userImgUrl,
        userId: userId
    })
})



app.get('/auth/user/:id', async (req, res) => {
    const userRaw =  await User.findById(req.params.id)
    const user = userRaw.toObject()

    let articleObjects = [];
    let isCurrentUser = false

    if (req.oidc.isAuthenticated()){
        sub = req.oidc.user.sub.split('|')
        userId = sub[sub.length - 1]

        if (userId === req.params.id){
            isCurrentUser = true
        }
    }

    for (i=0; i < user.articles.length; i++){
        article = await Article.findById(user.articles[i])
        articleObjects.push(article)
    }

    res.render('auth/user', {
        username: user.username,
        articleCount: user.articles.length,
        articles: articleObjects,
        picture: user.picture,
        isCurrentUser: isCurrentUser
    })
})


app.use("/articles", articleRouter)
app.listen(() => {
    console.log('app listening on '+process.env.PORT+'!');
  });
