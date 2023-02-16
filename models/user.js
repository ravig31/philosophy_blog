const mongoose = require('mongoose')

const userSchema =  new mongoose.Schema({
    sub: {
        type: String,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      picture: {
        type: String,
        required: true,
      },
      
});
    

module.exports = mongoose.model('userAuth', userSchema)