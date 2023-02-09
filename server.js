const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')


const DB_URL = "mongodb://127.0.0.1:27017/blogposts"
mongoose.set('strictQuery', true);
mongoose.connect(DB_URL);


app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(express.json())
app.set('view engine', 'ejs')


app.get('/', async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: 'desc'})
    res.render('articles/index', {articles: articles})
})



app.use("/articles", articleRouter)
app.listen(3000)