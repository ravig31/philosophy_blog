const mongoose = require('mongoose')
const {marked} = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const {JSDOM} = require('jsdom') 
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
    },
    markdown: {
        type: String,
        required: true, 
    },

    origURL: {
        type: String,
        required: false,
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    cleanedHtml: {
        type: String,
        required: true
    }
    
})


articleSchema.pre('validate', async function(next) {
    if (this.title) {
        let slug = slugify(this.title, {lower : true, strict: true })
        let articleWithSameSlug = await this.constructor.find({slug});

        while(articleWithSameSlug.length){
            slug = slug + Math.floor(Math.random() * 100)
            articleWithSameSlug = await this.constructor.find({slug});
        }
    this.slug = slug
    }

    if (this.markdown) {
        this.cleanedHtml = dompurify.sanitize(marked(this.markdown))
    }

    next()
})

module.exports = mongoose.model('Article', articleSchema)