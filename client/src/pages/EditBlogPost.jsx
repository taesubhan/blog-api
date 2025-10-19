import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';


import {useEditFetch, useGetPosts} from '../hooks/fetchAPI.jsx';
import {useNavigate} from 'react-router-dom';
import { useParams } from 'react-router-dom';

const apiURL = import.meta.env.VITE_API_URL + '/posts';

//user Id match
//bring title and post data to front-end

function EditBlogPostPage() {
    const {postID} = useParams();
    const apiPostURL = apiURL + '/' + postID

    const currentPostData = useGetPosts({postID});
    const currentPost = currentPostData.posts;
    const currentPostError = currentPostData.error;
    const currentLoading = currentPostData.loading;
    const {error, loading, fetchAPI} = useEditFetch(apiPostURL, false);
    const navigate = useNavigate();
    //

    async function handleEditPost(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const form = Object.fromEntries(formData.entries());
        form.isPosted = true;
        await fetchAPI(form);
        navigate(`/blog/${postID}`);
    }

    function handleCancelEdit(e) {
        e.preventDefault();
        navigate(`/blog/${postID}`);
    }

    if (loading || currentLoading) return <div className="loading">Loading...</div>
    if (error || currentPostError) return <div className="error">{error || currentPostError}</div>

    return (
        <div className="container">
            <Header />
            <div className="editBlog blogFormContainer">
                <div className="title">Edit Blog Post</div>
                <form className="editBlogForm blogForm" onSubmit={handleEditPost}>
                    <label htmlFor="blogTitle">Title: </label>
                    <input type="text" id="blogTitle" name="title" defaultValue={currentPost.title} />
                    <label htmlFor="postText">Blog: </label>
                    <textarea name="postText" id="postText" defaultValue={currentPost.post_text}></textarea>
                    <div className="formButtons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default EditBlogPostPage;