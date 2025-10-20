const db = require('../database/query/postQuery.js');
const {CustomNotFoundError, CustomInternalServerError} = require('../errors/errorHandler.js');

async function getAllPosts(req, res) {
    const {userid, search} = req.query;
    // console.log(search);
    const postList = await db.getAllPosts(userid, search);
    console.log('allposts', postList);
    res.json(postList);
}

async function getPost(req, res) {
    const {postID} = req.params;
    const post = await db.getPost(postID);
    
    if (!post) {
        throw new CustomNotFoundError('Post not found');
    }

    post.comments_URL = `http://localhost:3000/api/posts/${postID}/comments`;
    res.json(post);
}

async function editPost(req, res) {
    const {postID} = req.params;
    const {title, postText, isPosted} = req.body;
    const updatedPostID = await db.editPost(postID, title, postText, isPosted);
    if (!updatedPostID) {
        throw new CustomNotFoundError('Post not found. Edit was not made');
    }
    res.json(req.body);
}

async function addNewPost(req, res) {
    const {title, postText, userID, isPosted} = req.body;
    const newPostID = await db.addNewPost(title, postText, userID, isPosted);
    if (!newPostID) {
        throw new CustomInternalServerError('Unknown server error. Post not created');
    }
    res.json({
        post_id: newPostID.id,
        post_URL: `http://localhost:3000/api/posts/${newPostID.id}`
    });
}

async function deletePost(req, res) {
    const {postID} = req.params;
    const deletedPostID = await db.deletePostsWithComments(postID);
    if (!deletedPostID) {
        throw new CustomNotFoundError('Post not found');
    }
    res.json({post_id: postID});
}

async function getCommentsByPost(req, res) {
    const {postID} = req.params;
    const isPostInDB = db.getPost(postID);
    if (!isPostInDB) {
        throw new CustomNotFoundError('Post not found');
    }
    const commentsList = await db.getAllComments(postID);

    res.json(commentsList);
}

async function addCommentToPost(req, res) {
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
}

async function deleteComment(req, res) {
    const {commentID} = req.params;
    const deletedCommentID = await db.deleteComment(commentID);
    if (!deletedCommentID) {
        throw new CustomNotFoundError('Comment not found');
    }
    res.json({comment_id: commentID});
}

module.exports = {
    getAllPosts,
    getPost,
    editPost,
    addNewPost,
    deletePost,
    getCommentsByPost,
    addCommentToPost,
    deleteComment
}