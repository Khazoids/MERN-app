const asyncHandler = require('express-async-handler');
const { uuid } = require('uuidv4');
// Models
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');


// @desc    Create a comment
// @route   POST /api/comments/:postId
// @access  Private
const leaveComment = asyncHandler (async (req, res) => {
    
    if(!req.body.comment) {
        res.status(400);
        throw new Error('Please add text.');
    }

    let comment = await Comment.create({
        author: `${req.user.firstName} ${req.user.lastName}`,
        authorId: req.user.id,
        post: req.body.post,
        comment: req.body.comment,
        isReply: false
    })

    comment = await (await comment.populate('authorId')).populate('replies')

    await Post.findByIdAndUpdate(req.params.postId, {
        $push: {
            comments: comment._id
        }
    })

    if(comment) {
        res.status(200).json(comment);
    } else {
        res.status(400);
        throw new Error('Missing comment data.');
    }
})

// @desc    Update a comment
// @route   PUT /api/comments/:commentId
// @access  Private
const editComment = asyncHandler (async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);

    if(!comment) {
        res.status(400);
        throw new Error(`Comment ID: ${req.params.commentId} does not exist`);
    }

    if(comment.authorId._id.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to edit comment.');
    }

    updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, {new: true});
    
    updatedComment = await Comment.findById(req.params.commentId);

    res.status(200).json(updatedComment);
})

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentID
//@access   Private
const deleteComment = asyncHandler (async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);

    if(!comment) {
        res.status(400);
        throw new Error(`Comment ID: ${req.params.commentId} does not exist`);
    }

    if(comment.authorId._id.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to delete comment.');
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({ id: req.params.commentId });
})

const getPostComments = asyncHandler (async (req,res) => {
   

    const comments = await Comment.find({
        post: req.params.postId,
        isReply: false
        })
        .populate('authorId')
        .populate({
            path: 'replies',
            populate: {
                path:'authorId'
            }
    })
    
    res.status(200).json(comments)
})

const leaveReply = asyncHandler (async (req, res) => {
    if(!req.body.comment) {
        res.status(400);
        throw new Error('Please add text')
    }

    let reply = await Comment.create({
        author: `${req.user.firstName} ${req.user.lastName}`,
        authorId: req.user.id,
        post: req.body.post,
        comment: req.body.comment,
        isReply: true
    })

    const comment = await Comment.findByIdAndUpdate(req.params.commentId, {
        $push: {
            replies: reply._id
        }
    })

    reply = await reply.populate('authorId')
    
    
    res.status(200).json({
        _id: reply._id,
        commentId: req.params.commentId,
        author: reply.author,
        authorId: reply.authorId,
        post: reply.post,
        comment: reply.comment,
        replies: [],
        isReply: reply.isReply
    }
    );
})

// @desc    Update a comment
// @route   PUT /api/comments/:commentId
// @access  Private
const editReply = asyncHandler (async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);

    if(!comment) {
        res.status(400);
        throw new Error(`Comment ID: ${req.params.commentId} does not exist`);
    }

    if(comment.authorId._id.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to edit comment.');
    }

    
    let updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, {new: true});
    updatedComment = await Comment.findById(req.params.commentId);

    res.status(200).json({
        _id: updatedComment._id,
        author: updatedComment.author,
        authorId: updatedComment.authorId,
        post: updatedComment.post,
        replies: updatedComment.replies,
        comment: updatedComment.comment,
        isReply: updatedComment.isReply,

    });
})


module.exports = {
    leaveComment,
    editComment,
    deleteComment,
    getPostComments,
    leaveReply,
    editReply
}