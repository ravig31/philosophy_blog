const express = require('express')
const { default: mongoose } = require('mongoose')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('articles/new', {article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
    console.log('called edit')
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article })
})

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne( {slug : req.params.slug})
    if (article == null) res.redirect('/')
    res.render('articles/show', {article: article})
})

router.put('/:id', async (req, res) => {
    console.log('editted')
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.redirect(`/articles/${article.slug}`)})

  
router.post('/', async (req, res, next) => {
    req.article = new Article()
    console.log('called new')
    next()
}, saveAndRedirect('new'))


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
