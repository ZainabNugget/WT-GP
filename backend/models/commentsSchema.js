const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    comments: [{
        username: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],
    approved: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('PostComment', commentSchema);
