const {Router} = require('express');
const postRouter = Router();

const db = require('../database/query/postQuery.js');
const {CustomNotFoundError, CustomInternalServerError} = require('../errors/errorHandler.js');
const {tokenVerify} = require('../controllers/authenticationController.js');

// route: /api/posts

postRouter.get('/', async (req, res) => {
    const postList = await db.getAllPosts();
    
    res.json(postList);
});

postRouter.get('/:postID', async (req, res) => {
    const {postID} = req.params;
    const post = await db.getPost(postID);
    
    if (!post) {
        throw new CustomNotFoundError('Post not found');
    }

    post.comments_URL = `http://localhost:3000/api/posts/${postID}/comments`;
    res.json(post);
});

postRouter.put('/:postID', tokenVerify, async (req, res) => {
    const {postID} = req.params;
    const {title, postText, isPosted} = req.body;
    const updatedPostID = await db.editPost(postID, title, postText, isPosted);
    if (!updatedPostID) {
        throw new CustomNotFoundError('Post not found. Edit was not made');
    }
    res.json(req.body);
})

postRouter.post('/', tokenVerify, async (req, res) => {
    const {title, postText, userID, isPosted} = req.body;
    const newPostID = await db.addNewPost(title, postText, userID, isPosted);
    if (!newPostID) {
        throw new CustomInternalServerError('Unknown server error. Post not created');
    }
    res.json({
        post_id: newPostID.id,
        post_URL: `http://localhost:3000/api/posts/${newPostID.id}`
    });
});

postRouter.delete('/:postID', tokenVerify, async (req, res) => {
    const {postID} = req.params;
    const deletedPostID = await db.deletePostsWithComments(postID);
    if (!deletedPostID) {
        throw new CustomNotFoundError('Post not found');
    }
    res.json({post_id: postID});
})

postRouter.get('/:postID/comments', async (req, res) => {
    const {postID} = req.params;
    const isPostInDB = db.getPost(postID);
    if (!isPostInDB) {
        throw new CustomNotFoundError('Post not found');
    }
    const commentsList = await db.getAllComments(postID);

    res.json(commentsList);
});

postRouter.post('/:postID/comments', tokenVerify, async (req, res) => {
    const {postID} = req.params;
    const isPostInDB = db.getPost(postID);
    if (!isPostInDB) {
        throw new CustomNotFoundError('Post not found');
    }
    const {commentText, userID} = req.body;
    const commentID = await db.addComment(commentText, postID, userID);
    res.json({
        comment_id: commentID.id,
        comments_URL: `http://localhost:3000/api/posts/${postID}/comments`
    });
})

postRouter.delete('/comments/:commentID', tokenVerify, async (req, res) => {
    const {commentID} = req.params;
    const deletedCommentID = await db.deleteComment(commentID);
    if (!deletedCommentID) {
        throw new CustomNotFoundError('Comment not found');
    }
    res.json({comment_id: commentID});
})


module.exports = {postRouter};