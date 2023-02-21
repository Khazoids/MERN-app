const express = require('express');
const { leaveComment, editComment, deleteComment, getPostComments, leaveReply, editReply } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/:postId', protect, leaveComment);
router.put('/:commentId', protect, editComment);
router.delete('/:commentId', protect, deleteComment);
router.get('/:postId/comments', getPostComments)
router.post('/:commentId/reply', protect, leaveReply)
router.put('/:commentId/reply', protect, editReply)


module.exports = router;