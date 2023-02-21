const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

// @desc    Get user posts
// @route   GET 
// @access  Private
const getPosts = asyncHandler (async (req, res) => {
    const posts = await Post.find( { author: req.user.id });

    res.status(200).json(posts);
})

const getAllPosts = asyncHandler (async (req, res) => {
    const posts = await Post.find().populate('authorId').populate({
        path: 'comments',
        populate: {
            path:'authorId'
        }
    });

    res.status(200).json(posts);
})


// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler (async (req, res) => {
    const { title, description, body } = req.body;
    

    if(!title || !description || !body) {
        res.status(400)
        throw new Error('Please enter all fields.');
    }

    // Create post in database
    const post = await Post.create({
        author: `${req.user.firstName} ${req.user.lastName}`,
        authorId: req.user.id,
        title: title,
        description: description,
        body: body
    })

    if(post) {
        res.status(201).json({
            _id: post.id,
            author: `${req.user.firstName} ${req.user.lastName}`,
            authorId: req.user.id,
            title: post.title,
            description: post.description,
            body: post.body
        })
    } else {
        res.status(400);
        throw new Error('Invalid post data.');
    }
})

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler (async (req, res) => {

    // Check if posts exists
    const post = await Post.findById(req.params.id);

    if(!post) {
        res.status(400);
        throw new Error(`Post ${req.params.id} does not exists.`);
    }

    // Check if post is owned by the correct user before pushing updates
    if(post.authorId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('You are not authorized to make changes to this post.');
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});

    res.status(200).json({updatedPost});
})

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler (async (req, res) => {
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if(!post) {
        res.status(400);
        throw new Error('Invalid post ID');
    } 

    if(post.authorId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('You are not authorized to make changes to this post.');
    }
    
    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({id: req.params.id });
    
})

// @desc    Get all post comments
// @route   GET /api/posts/:postId
// @access  Public
const getPostDetails = asyncHandler (async (req, res) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'authorId'
        }
    })
   
    res.status(200).json(post);
})


module.exports = {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    getPostDetails
}