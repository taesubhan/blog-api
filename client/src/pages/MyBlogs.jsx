import BlogPostsList from '../components/BlogPostList.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';


function MyBlogsPage() {
    const userID = localStorage.getItem('userID');

    return (
        <div className="container">
            <Header />
            <BlogPostsList userID={userID}/>
            <Footer />
        </div>
    )
}

export default MyBlogsPage;