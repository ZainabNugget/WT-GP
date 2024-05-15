const mongoose = require('mongoose')
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    summary: {
        type:String,
        maxLength:200
    },
    body: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    comments: [{
        username: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        likes: [{
            username: {
                type: String,
                unique: true
            }
        }]
    }],
    slug: {
        type: String,
        required: true,
        unique: true
    }
  })

  postSchema.pre('validate', function(next) {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true })
    }
    next()
  })

module.exports = mongoose.model('Posts', postSchema)