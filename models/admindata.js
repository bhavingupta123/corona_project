const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    email: {
      type: String
    },
    password: {
      type: String
    }
  })

  
module.exports = mongoose.model('Admin', adminSchema)