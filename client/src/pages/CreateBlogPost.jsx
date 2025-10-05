import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

// import {useState} from 'react';
import {usePostFetch} from '../hooks/fetchAPI.jsx';
import {Link} from 'react-router-dom';

const apiURL = import.meta.env.VITE_API_URL + '/posts';



function CreateBlogPostPage() {
    // const [formData, setFormData] = useState(null);
    // const {isAuth, error, loading, result} = usePostFetch(apiURL, formData, enabled);
    const {result, error, loading, fetchAPI} = usePostFetch(apiURL, false);

    function handleCreateNewPost(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const form = Object.fromEntries(formData.entries());
        form.userID = localStorage.getItem('userID');
        form.isPosted = true;
        fetchAPI(form);
        e.target.reset();
    }

    if (loading) return <div className="loading">Loading...</div>
    if (error) return <div className="error">{error}</div>
    if (result) return (
        <div className="postedSuccess">
            <div>Successfully submitted blog post</div>
            <Link to={`/blog/${result.post_id}`}>Go to blog</Link>
        </div>
    )
    return (
        <div className="container">
            <Header />
            <div className="title">Create Blog Post</div>
            <form className="createNewBlogForm" onSubmit={handleCreateNewPost}>
                <label htmlFor="blogTitle">Title: </label>
                <input type="text" id="blogTitle" name="title"/>

                <label htmlFor="postText">Blog: </label>
                <textarea name="postText" id="postText"></textarea>

                <button type="submit">Create Post</button>
            </form>
            <Footer />
        </div>
    )
}

export default CreateBlogPostPage;