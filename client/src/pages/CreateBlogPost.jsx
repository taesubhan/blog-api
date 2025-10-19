import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

// import {useState} from 'react';
import {usePostFetch} from '../hooks/fetchAPI.jsx';
import {Link} from 'react-router-dom';

const apiURL = import.meta.env.VITE_API_URL + '/posts';



function CreateBlogPostPage() {
    const {result, error, loading, fetchAPI} = usePostFetch(apiURL, false);

    async function handleCreateNewPost(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const form = Object.fromEntries(formData.entries());
        form.userID = localStorage.getItem('userID');
        form.isPosted = true;
        await fetchAPI(form);
        e.target.reset();
    }

    if (loading) return <div className="loading">Loading...</div>
    if (error) return <div className="error">{error}</div>
    if (result) return (
        <div className="postedSuccess">
            <div>Successfully Created Post!</div>
            <Link to={`/blog/${result.post_id}`}>Go To Blog</Link>
        </div>
    )
    return (
        <div className="container">
            <Header />
            <div className="createNewBlog blogFormContainer">
                <div className="title">Create Blog Post</div>
                <form className="createNewBlogForm blogForm" onSubmit={handleCreateNewPost}>
                    <label htmlFor="blogTitle">Title: </label>
                    <input type="text" id="blogTitle" name="title"/>
                    <label htmlFor="postText">Blog: </label>
                    <textarea name="postText" id="postText"></textarea>
                    <button type="submit">Create Post</button>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default CreateBlogPostPage;