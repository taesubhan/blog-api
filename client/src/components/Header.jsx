import {Link} from 'react-router-dom';

function Header() {
    return (
        <div className="header">
            <div className="logo">
                <p className="logoItem">[Insert Logo Here]</p>
            </div>
            <div className="menuItems">
                <Link className="homePageButton" to='/home'>Home</Link>
                <div className="myBlogsButton">My Blogs</div>
                <Link className="createBlogPost" to="/create">Create New Post</Link>
            </div>
            <div className="settings">
                <div className="settings">Settings</div>
                <div className="logOut">Log Out</div>
            </div>
        </div>
    )
}

export default Header;