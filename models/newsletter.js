const mongoose = require('mongoose')

const newsletterschema = new mongoose.Schema({
    
    name:{
        type: String
    },
    last:{
        type: String
    },
    email:{
      type: String
    },
    query:{
      type: String
    }
  })

  
module.exports = mongoose.model('Newsletters1', newsletterschema)