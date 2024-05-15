const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    likes: [{
        username: {
            type: String,
            required: true,
            unique:true
        }
    }],
    approved: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);
