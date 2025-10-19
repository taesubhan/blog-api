import { useParams, useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import {useGetPosts, useDeletePost, useGetComments, usePostComment, useDeleteComment} from '../hooks/fetchAPI.jsx';
import { UserAuthElementRestriction } from '../components/AuthRestriction.jsx';
import convertDate from '../functions/dateTime.js';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function CommentSection({postID}) {
    const [refresh, setRefresh] = useState(0);
    const {comments, error, loading} = useGetComments({postID}, true, refresh);
    const [commentCount, setCommentCount] = useState(comments ? comments.length : 0);
    const apiURL = import.meta.env.VITE_API_URL + '/posts' + `/${postID}/comments`;
    const {fetchAPI: sendComment} = usePostComment(apiURL);
    const {fetchAPI: deleteComment} = useDeleteComment();

    useEffect(() => {
        if (comments) {
            setCommentCount(comments.length)
        }
    }, [comments])

    if (!comments) return null;
    if (error) return <div className="error">{error}</div>
    if (loading) return <div className="loading">Loading... </div>
    
    async function handleCommentDelete(e) {
        e.preventDefault();
        const commentID = e.target.getAttribute('commentid');
        await deleteComment(commentID);
        setRefresh((r) => r + 1);
    }

    const commentsElem = comments.map((comment) => {
        
        return (
            <div className="comment" key={comment.id}>
                <p className="commentUser">{comment.author}</p>
                <p className="commentText">{comment.comment_text}</p>
                <p className="commentDateTime">{convertDate(comment.created_at)}</p>
                <UserAuthElementRestriction>
                    <button type="button" className="deleteComment" commentid={comment.id} onClick={handleCommentDelete}>X</button>
                </UserAuthElementRestriction>
                
            </div>
        )
    })

    async function handleSendComment(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const form = Object.fromEntries(formData.entries());
        form.userID = localStorage.getItem('userID');
        await sendComment(form);
        e.target.reset();
        setRefresh((r) => r + 1);
    }

    
    return (
        <div className="commentSection">
            <h3>Comments ({commentCount})</h3>
            <div className="commentList">{commentsElem}</div>
            <div className="createComments">
                <form className="createNewCommentForm" onSubmit={handleSendComment}>
                    <label htmlFor="commentText">Comment: </label>
                    <textarea name="commentText" id="commentText"></textarea>

                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    )
}

function BlogPostPage() {
    const {postID} = useParams();
    const {posts, error, loading} = useGetPosts({postID});
    const {fetchAPI: deletePost, error: deleteError} = useDeletePost();
    
    const navigate = useNavigate();
    function handleEdit() {
        navigate(`/blog/${postID}/edit`);
    }

    function handleDelete() {
        deletePost(postID);
        navigate(`/home`);
    }

    if (loading) return <div className="loadingScreen">Loading...</div>
    if (error || deleteError) return <div className="errorScreen">{deleteError}</div>
    
    return (
        <div className="container">
            <Header />
            <div className="blogPost">
                <UserAuthElementRestriction>
                    <div className="adminControls">
                        <button onClick={handleEdit}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </UserAuthElementRestriction>
                <div className="postText">
                    <div className="blogTitle">{posts.title}</div>
                    <div className="blogAuthor">By: {posts.author}</div>
                    <div className="blogText">{posts.post_text}</div>
                </div>
            
                <CommentSection postID={postID}/>

            </div>
            <Footer />
        </div>
    )
}

export default BlogPostPage;