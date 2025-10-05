// import {useState, useEffect} from 'react';
import useGetPosts from '../hooks/useGetPosts.jsx';
import {useNavigate} from 'react-router-dom';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const summaryCharCutoff = 10;


function HomeSection() {
    const {posts, error, loading} = useGetPosts();
    const navigate = useNavigate();

    const postItems = posts.map((post) => {
        return (
            <div className="postContainer" postid={post.id} key={post.id} onClick={() => navigate(`/blog/${post.id}`)}>
                <div className="postTitle">{post.title}</div>
                <div className="postAuthor">By: {post.author}</div>
                <div className="postTextCutOut">{post.post_text.slice(0,summaryCharCutoff) + '...'}</div>                
            </div>
        )
    })

    if (loading) return <div className="loadingScreen">Loading...</div>
    if (error) return <div className="errorScreen">{error}</div>
    return (
        <div className="homePage">
            <div className="blogPostsContainer">{postItems}</div>
        </div>
    )
}

function HomePage() {
    return (
        <div className="container">
            <Header />
            <HomeSection />
            <Footer />
        </div>
    )
}

export default HomePage;