const pool = require('./pool');

// async function 
async function getAllPosts() {
    const {rows} = await pool.query(`
        SELECT
        bp.id
        ,bp.title
        ,bp.post_text
        ,bp.created_at
        ,bp.updated_at
        ,bp.is_posted
        ,u.fullname AS author
        FROM blog_posts bp
        LEFT JOIN users u
            ON bp.user_id = u.id
        ORDER BY bp.id asc;
    `);

    return rows;
}

async function getPost(postID) {
    const {rows} = await pool.query(`
        SELECT
        bp.id
        ,bp.title
        ,bp.post_text
        ,bp.created_at
        ,bp.updated_at
        ,bp.is_posted
        ,u.fullname AS author
        FROM blog_posts bp
        LEFT JOIN users u
            ON bp.user_id = u.id
        WHERE bp.id = $1
        ORDER BY bp.id ASC;
    `, [postID]);

    return rows[0] || null;
}

async function addNewPost(title, postText, userID, isPosted) {
    const {rows} = await pool.query(`
        INSERT INTO blog_posts (title, post_text, user_id, created_at, updated_at, is_posted)
        VALUES ($1, $2, $3, NOW(), NOW(), $4)
        RETURNING id;
    `, [title, postText, userID, isPosted]);
    
    return rows[0] || null;
}

async function editPost(postID, title, postText, isPosted) {
    const {rows} = await pool.query(`
        UPDATE blog_posts
        SET title = $2,
            post_text = $3,
            updated_at = NOW(),
            is_posted = $4
        WHERE id = $1
        RETURNING id;
    `, [postID, title, postText, isPosted]);

    return rows[0] || null;
}

async function deletePost(postID) {
    const {rows} = await pool.query(`
        DELETE FROM blog_posts
        WHERE id = $1
        RETURNING id;
    `, [postID]);

    return rows[0] || null;
}

async function deleteAllComments(postID) {
    await pool.query(`
        DELETE FROM post_comments
        WHERE post_id = $1;    
    `, [postID])
}

async function deletePostsWithComments(postID) {
    try {
        await pool.query(`BEGIN;`);
        await deletePost(postID);
        await deleteAllComments(postID);
        await pool.query(`COMMIT;`);
    } catch(err) {
        await pool.query(`ROLLBACK;`);
        throw new Error(err);
    }
}

async function getAllComments(postID) {
    const {rows} = await pool.query(`
        SELECT 
        pc.id
        ,pc.comment_text
        ,u.fullname AS author
        ,pc.created_at
        FROM post_comments pc
        LEFT JOIN users u
            ON pc.user_id = u.id
        WHERE post_id = $1
        ORDER BY pc.id ASC;
    `, [postID]);

    return rows;
}

async function addComment(commentText, postID, userID) {
    const {rows} = await pool.query(`
        INSERT INTO post_comments (comment_text, post_id, user_id, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id;
    `, [commentText, postID, userID]);

    return rows[0];
}

async function deleteComment(commentID) {
    const {rows} = await pool.query(`
        DELETE FROM post_comments
        WHERE id = $1;    
    `, [commentID]);

    return rows[0] || null;
}

module.exports = {
    getAllPosts,
    getPost,
    editPost,
    deletePost,
    deleteAllComments,
    getAllComments,
    addNewPost,
    addComment,
    deleteComment,
    deletePostsWithComments
}