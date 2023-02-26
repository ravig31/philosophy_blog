const mongoose = require('mongoose')


module.exports = mongoose.model('userauths',{
    articles: [String]
  });

