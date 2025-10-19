import {useState} from 'react';
import {useGetPosts} from '../hooks/fetchAPI.jsx';

import {useNavigate} from 'react-router-dom';

const summaryCharCutoff = 30;


function BlogPostsList({userID}) {
    const [searchText, setSearchText] = useState(null);
    const {posts, error, loading} = useGetPosts({userID, searchText}, true, searchText);
    const navigate = useNavigate();

    const postItems = posts ? posts.map((post) => {
        return (
            <div className="postContainer" postid={post.id} key={post.id} onClick={() => navigate(`/blog/${post.id}`)}>
                <div className="postTitle">{post.title}</div>
                <div className="postAuthor">By: {post.author}</div>
                <div className="postTextCutOut">{post.post_text.slice(0,summaryCharCutoff) + '...'}</div>                
            </div>
        )
    })
    : null

    function handleSearch(e) {
        setSearchText(e.target.value);
    }

    if (loading) return <div className="loadingScreen">Loading...</div>
    if (error) return <div className="errorScreen">{error.message}</div>

    return (
        <div className="blogList">
            <div className="searchContainer">
                <label htmlFor="search" className="searchLabel">Search: </label>
                <input type="search" id="search" className="searchInput" onChange={handleSearch}/>
            </div>
            <div className="blogPostsContainer">{postItems}</div>
        </div>
    )
}

export default BlogPostsList;