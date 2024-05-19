const mongoose = require('mongoose')
const slugify = require('slugify');

// This schema includes the title, summary, body, image path, username and comments
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
    image: {
        type: String
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
        userApproved: {
            type: Boolean,
            default: false
        },
        likes: {
            type: Number,
            default: 0
        }
    }],
    slug: {
        type: String,
        required: true,
        unique: true
    },
    approved: {
        type: Boolean,
        default: true
    }
  })

  postSchema.pre('validate', function(next) {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true })
    }
    next()
  })

//  Export the schema to mongodb
module.exports = mongoose.model('Posts', postSchema)