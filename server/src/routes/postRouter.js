const {Router} = require('express');
const postRouter = Router();

const db = require('../database/query.js');

// route: /api/posts

postRouter.get('/posts', async (req, res) => {
    const postList = await db.getAllPosts();
    
    res.json(postList);
});

postRouter.get('/posts/:postID', async (req, res) => {
    const {postID} = req.params;
    const post = await db.getPost(postID);
    post[0].comments_URL = `http://localhost:3000/api/posts/${postID}/comments`
    res.json(post[0]);
});

postRouter.put('/posts/:postID', async (req, res) => {
    const {postID} = req.params;
    const {title, postText, isPosted} = req.body;
    await db.editPost(postID, title, postText, isPosted);
    res.json(req.body);
})

postRouter.post('/posts', async (req, res) => {
    const {title, postText, userID, isPosted} = req.body;
    const newPostID = await db.addNewPost(title, postText, userID, isPosted);
    res.json({
        post_id: newPostID.id,
        post_URL: `http://localhost:3000/api/posts/${newPostID.id}`
    });
});

postRouter.delete('/posts/:postID', async (req, res) => {
    const {postID} = req.params;
    await db.deletePostsWithComments(postID);
    res.json({post_id: postID});
})

postRouter.get('/posts/:postID/comments', async (req, res) => {
    const {postID} = req.params;
    const commentsList = await db.getAllComments(postID);

    res.json(commentsList);
});

postRouter.post('/posts/:postID/comments', async (req, res) => {
    const {postID} = req.params;
    const {commentText, userID} = req.body;
    const commentID = await db.addComment(commentText, postID, userID);
    res.json({
        comment_id: commentID.id,
        comments_URL: `http://localhost:3000/api/posts/${postID}/comments`
    });
})

postRouter.delete('/comments/:commentID', async (req, res) => {
    const {commentID} = req.params;
    await db.deleteComment(commentID);
    res.json({comment_id: commentID});
})


module.exports = {postRouter};