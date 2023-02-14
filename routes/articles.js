const express = require('express')
const { default: mongoose } = require('mongoose')
const Article = require('./../models/article')
const router = express.Router()
const api = require('../api/medium-api')
const authenticateToken = require('../middleware/authenticate')



router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})


router.get('/share',(req, res) => {
    res.render('articles/share')
})

router.get('/edit/:id', async (req, res) => {
    console.log('called edit')
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article })
})

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({slug : req.params.slug});
    if (article == null) res.redirect('/');
    res.render('articles/show', {article: article});
});


router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveAndRedirect('edit'))

  
router.post('/new', async (req, res, next) => {
    console.log('new post')
    req.article = new Article()
    next()
}, saveAndRedirect('new'))


router.post('/share', async (req, res, next) => {
    const mediumURLparts = (req.body.mediumurl).split('-');
    const ArticleID = mediumURLparts[mediumURLparts.length - 1];
    const articleData = await api.processArticleID(ArticleID);

    let article = new Article()
    article.title = articleData.title
    article.description = articleData.description
    article.markdown = articleData.markdown
    article.origURL = articleData.origURL

    try{
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    } catch (e){
        res.render(`articles/${path}`, {article: article})
    }
  });
  


router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


function saveAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown

        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e){
            res.render(`articles/${path}`, {article: article})
        }
    }
}


console.log("SERVER IS RUNNING")
module.exports = router
