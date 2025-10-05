import { useParams } from 'react-router-dom';
import {useGetPosts} from '../hooks/fetchAPI.jsx';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function BlogPostPage() {
    const {postID} = useParams();

    const {posts, error, loading} = useGetPosts({postID});
    if (loading) return <div className="loadingScreen">Loading...</div>
    if (error) return <div className="errorScreen">{error}</div>
    
    return (
        <div className="container">
            <Header />
            <div className="blogPost">
                <button>Edit</button>
                <div className="postText">
                    <div className="blogTitle">{posts.title}</div>
                    <div className="blogAuthor">By: {posts.author}</div>
                    <div className="blogText">{posts.post_text}</div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default BlogPostPage;