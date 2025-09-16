const {Router} = require('express');
const postRouter = Router();
const {getAllPosts,
    getPost,
    editPost,
    addNewPost,
    deletePost,
    getCommentsByPost,
    addCommentToPost,
    deleteComment} = require('../controllers/postController.js');
const {tokenVerify} = require('../controllers/authenticationController.js');

// route: /api/posts

postRouter.get('/', getAllPosts);
postRouter.get('/:postID', getPost);
postRouter.put('/:postID', tokenVerify, editPost);
postRouter.post('/', tokenVerify, addNewPost);
postRouter.delete('/:postID', tokenVerify, deletePost);
postRouter.get('/:postID/comments', getCommentsByPost);
postRouter.post('/:postID/comments', tokenVerify, addCommentToPost);
postRouter.delete('/comments/:commentID', tokenVerify, deleteComment);


module.exports = {postRouter};