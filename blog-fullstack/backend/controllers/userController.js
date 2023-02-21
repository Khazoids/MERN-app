const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// Models
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if(!firstName || !lastName || !email || !password) {
        res.status(400)
        throw new Error('Please enter all fields.');
    }

    // Check if user already exists in database
    const userExists = await User.findOne({email});

    if(userExists) {
        res.status(400);
        throw new Error('User already exists.');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email: email.toUpperCase(),
        password: hashedPass
    });

    // Check if user was successfully created
    if(user) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user.id)
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
})

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler (async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists via email
    const user = await User.findOne({email: email.toUpperCase()});

    if(user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user.id)
        })
    } else {
        res.status(400);
        throw new Error('Invalid login credentials.')
    }
})


// @desc    Get all user comments
// @route   GET /api/users/comments
// @access  Private
const getUserComments = asyncHandler (async (req, res) => {
    const comments = await Comment.find( {author: req.user.id });

    res.status(200).json(comments);
})



// Generate a JWT for authentication
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '30d'});
}

module.exports = {
    registerUser,
    loginUser,
    getUserComments
}