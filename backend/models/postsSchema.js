const mongoose = require('mongoose')

const postsSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique: true
    },
    summary: {
        type: String,
        required: true,
    },
    paragraph: {
        type:String
    }
  })

module.exports = mongoose.model('Posts', postsSchema)