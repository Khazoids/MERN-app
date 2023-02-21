const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    author: {
        type: String,
        require: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Post'
    },
    comment: {
        type: String,
        require: [true, 'Please add a comment.']
    },
    replies : [
        {
            type: mongoose.Schema.Types.ObjectId,
            require: false,
            ref: 'Comment'
        }
    ],
    isReply: {
        type: Boolean,
        require: [true, 'Please specify if this is a comment or reply.']
    }
},
{
    timestamps: true
})


let autoPopulateReplies = function(next) {
    this.populate('replies');
    next();
}

let autoPopulateAuthorID = function(next) {
    this.populate('authorId');
    next();
}


commentSchema.
    pre('findOne', autoPopulateReplies).
    pre('find', autoPopulateReplies).
    pre('findOne', autoPopulateAuthorID).
    pre('find', autoPopulateAuthorID)
    
module.exports = mongoose.model('Comment', commentSchema);