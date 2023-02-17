const express = require('express')
const { default: mongoose } = require('mongoose')
const Article = require('./../models/article')
const User = require('./../models/user')
const router = express.Router()
const api = require('../api/medium-api')
const { auth, requiresAuth } = require('express-openid-connect');



router.get('/new', requiresAuth(), (req, res) => {
    res.render('articles/new', { article: new Article() })
})


router.get('/share', requiresAuth(), (req, res) => {
    res.render('articles/share')
})

router.get('/edit/:id', async (req, res) => {
    console.log('called edit')
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article })
})

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    let fromMedium = false;
  
    if (article == null) {
      res.redirect('/');
    } else {
      if (article.hasOwnProperty('origURL') && article.origURL) {
        fromMedium = true;
      }
      res.render('articles/show', { article, fromMedium });
    }
  });


router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveAndRedirect('edit'))

  
router.post('/new', async (req, res, next) => {
    req.article = new Article()

    const sub = req.oidc.user.sub.split('|')
    const userId = sub[sub.length - 1]

    // add article to user DB
    updateUserArticles(userId, req.article.id)
    next()
}, saveAndRedirect('new', userId))


router.post('/share', async (req, res, next) => {
    const mediumURLparts = (req.body.mediumurl).split('-');
    const mediumId = mediumURLparts[mediumURLparts.length - 1];
    const articleData = await api.processArticleID(mediumId);
    
    let article = new Article()
    article.title = articleData.title
    article.description = articleData.description
    article.markdown = articleData.markdown
    article.origURL = articleData.url

    try{
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    } catch (e){
        res.render(`articles/${path}`, {article: article})
    }

    const sub = req.oidc.user.sub.split('|')
    const userId = sub[sub.length - 1]

    updateUserArticles(userId, article.id)

  });
  


router.delete('/:id', async (req, res) => {
    const sub = req.oidc.user.sub.split('|')
    const userId = sub[sub.length - 1]

    User.updateOne({ _id: userId }, { $pull: { articles: req.params.id} }, (err, result) => {
        if (err) {
          console.error('Error deleting article:', err);
        } else {
          console.log('Article deleted');
        }
      });

    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


function updateUserArticles(userId, articleId){
    User.updateOne({ _id: userId }, { $push: { articles: articleId } }, (err, result) => {
    if (err) {
        console.error('Error adding article:', err);
    } else {
        console.log('Article added');
    }
    });
}


function saveAndRedirect(path, userId = null) {
    console.log(userId)
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
