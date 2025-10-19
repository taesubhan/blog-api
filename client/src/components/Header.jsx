import {Link, useNavigate} from 'react-router-dom';
import {useAuthContext} from '../context/AuthContext';
import {useAuthenticate} from '../hooks/fetchAPI';
import {useState} from 'react';

import blogLogo from '../assets/images/blogLogo.png';
import cog from '../assets/images/cog.svg';

function Header() {
    const [refresh, setRefresh] = useState(0);
    const {logout} = useAuthContext();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        setRefresh((prev) => prev + 1);
        navigate('/login');
    }
    const {isAuth, error: authError, loading: authLoading} = useAuthenticate(refresh);


    let authTrigger;
    let createBlogLink;
    let myBlogsLink;
    if (authError || authLoading) {
        authTrigger = null;
    }
    if (isAuth) {
        authTrigger = <div className="logOut menuLink" onClick={handleLogout}>Log Out</div>
        createBlogLink = <Link className="createBlogPost menuLink" to="/create">Create New Post</Link>
        myBlogsLink = <Link className="myBlogsButton menuLink" to='/myblogs'>My Blogs</Link>
    } else {
        authTrigger = <Link className="logIn menuLink" to="/login">Log In</Link>
    }

    return (
        <div className="header">
            <div className="logo">
                <img src={blogLogo} alt="blog logo" className="logoImage" />
            </div>
            <div className="menuItems">
                <Link className="homePageButton menuLink" to='/home'>Home</Link>
                {myBlogsLink}
                {createBlogLink}
            </div>
            <div className="settings">
                <div className="settingsButton">
                    <img src={cog} alt="settings icon" className="cogIcon" />
                </div>
                {authTrigger}
            </div>
        </div>
    )
}

export default Header;