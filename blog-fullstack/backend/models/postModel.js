const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        require: [true, 'Please add a title']
   },
    description: {
        type: String,
        require: [true, 'Please add a description']
   },
    body: {
        type: String,
        require: [true, 'Please add text']
   },
   comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
   }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', postSchema);