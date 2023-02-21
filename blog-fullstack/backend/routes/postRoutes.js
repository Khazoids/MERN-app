const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllPosts, createPost, updatePost, deletePost, getPostDetails } = require('../controllers/postController');

router.get('/', getAllPosts);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost)
router.delete('/:id', protect, deletePost);
router.get('/:id', getPostDetails)

module.exports = router;