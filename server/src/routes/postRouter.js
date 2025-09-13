const {Router} = require('express');
const postRouter = Router();

const db = require('../database/query.js');
const {CustomNotFoundError, CustomInternalServerError} = require('../errors/errorHandler.js');

// route: /api/posts

postRouter.get('/posts', async (req, res) => {
    const postList = await db.getAllPosts();
    
    res.json(postList);
});

postRouter.get('/posts/:postID', async (req, res) => {
    const {postID} = req.params;
    const post = await db.getPost(postID);
    
    if (!post) {
        throw new CustomNotFoundError('Post not found');
    }

    post.comments_URL = `http://localhost:3000/api/posts/${postID}/comments`;
    res.json(post);
});

postRouter.put('/posts/:postID', async (req, res) => {
    const {postID} = req.params;
    const {title, postText, isPosted} = req.body;
    const updatedPostID = await db.editPost(postID, title, postText, isPosted);
    if (!updatedPostID) {
        throw new CustomNotFoundError('Post not found. Edit was not made');
    }
    res.json(req.body);
})

postRouter.post('/posts', async (req, res) => {
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

postRouter.delete('/posts/:postID', async (req, res) => {
    const {postID} = req.params;
    const deletedPostID = await db.deletePostsWithComments(postID);
    if (!deletedPostID) {
        throw new CustomNotFoundError('Post not found');
    }
    res.json({post_id: postID});
})

postRouter.get('/posts/:postID/comments', async (req, res) => {
    const {postID} = req.params;
    const isPostInDB = db.getPost(postID);
    if (!isPostInDB) {
        throw new CustomNotFoundError('Post not found');
    }
    const commentsList = await db.getAllComments(postID);

    res.json(commentsList);
});

postRouter.post('/posts/:postID/comments', async (req, res) => {
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

postRouter.delete('/comments/:commentID', async (req, res) => {
    const {commentID} = req.params;
    const deletedCommentID = await db.deleteComment(commentID);
    if (!deletedCommentID) {
        throw new CustomNotFoundError('Comment not found');
    }
    res.json({comment_id: commentID});
})


module.exports = {postRouter};