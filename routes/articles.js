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
    let sub = null;
    let userId = null;
    req.article = await Article.findById(req.params.id)

    if (req.oidc.isAuthenticated()){
        sub = req.oidc.user.sub.split('|')
        userId = sub[sub.length - 1]
        if (req.article.author[0] === userId){
            res.render('articles/edit', {article: article })
        }
    }
    res.redirect('/')
    
})

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    let fromMedium = false;
  
    if (article == null) {
      res.redirect('/');
    } else {
      if (article.origURL) {
        fromMedium = true;
      }

      res.render('articles/show', { article : article, fromMedium: fromMedium, authorId: article.author[0],authorUsername: article.author[1], authorImg: article.author[2]});
    }
});

router.post('/:slug', requiresAuth(), async (req, res, next) => {

    Article.updateOne({ _id: req.body.articleId}, { $push: { comments: [req.oidc.user.nickname, req.body.comment, new Date(Date.now())] } }, (err, result) => {
        if (err) {
            console.error('Error adding comment:', err);
        } else {
            console.log('Comment Added');
        }
        });

    res.redirect(req.get('referer'))
})

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
    
    // save author info to article
    user =  await User.findOne({userId})
    username = user.toObject().user
    picture = user.toObject().picture

    req.article.author = [userId, username, picture]

    next()
}, saveAndRedirect('new'))


router.post('/share', async (req, res, next) => {
    const mediumURLparts = (req.body.mediumurl).split('-');
    const mediumId = mediumURLparts[mediumURLparts.length - 1];
    const articleData = await api.processArticleID(mediumId);
    
    const sub = req.oidc.user.sub.split('|')
    const userId = sub[sub.length - 1]

    let article = new Article()
    article.title = articleData.title
    article.description = articleData.description
    article.markdown = articleData.markdown
    article.origURL = articleData.url

    // add article to user DB
    updateUserArticles(userId, article.id)

    // save author info to article
    user =  await User.findOne({userId})
    username = user.toObject().username
    picture = user.toObject().picture

    article.author = [userId, username, picture]

    try{
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    } catch (e){
        res.render(`articles/${path}`, {article: article})
    }

  });

  


router.delete('/:id', async (req, res) => {
    let sub = null;
    let userId = null;
    article = await Article.findById(req.params.id)

    if (req.oidc.isAuthenticated()){
        sub = req.oidc.user.sub.split('|')
        userId = sub[sub.length - 1]
        if (article.author[0] === userId){
            const sub = req.oidc.user.sub.split('|')
            const userId = sub[sub.length - 1]
            article = await Article.findById(req.params.id)
            
            User.updateOne({ _id: userId }, { $pull: { articles: req.params.id} }, (err, result) => {
                if (err) {
                console.error('Error deleting article:', err);
                } else {
                console.log('Article deleted');
                }
            });
    
            await Article.findByIdAndDelete(req.params.id)
        }
    }


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
