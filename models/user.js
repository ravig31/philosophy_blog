const mongoose = require('mongoose')


module.exports = mongoose.model('userauths',{
    articles: [String]
  });

// UserAuth.updateOne({ _id: userId }, { $push: { articles: newArticle } }, (err, result) => {
// if (err) {
//     console.error('Error adding article:', err);
// } else {
//     console.log('Article added');
// }
// });

