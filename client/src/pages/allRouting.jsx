import { createBrowserRouter } from 'react-router-dom';
import SignUp from './Sign-up.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';
import BlogPost from './BlogPost.jsx';
import CreateBlogPost from './CreateBlogPost.jsx';
import {AuthPageRestriction, UserAuthPageRestriction } from '../components/AuthRestriction.jsx';
import EditBlogPostPage from './EditBlogPost.jsx';
import MyBlogsPage from './MyBlogs.jsx';

const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: 'signup',
      element: <SignUp />
    },
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'home',
      element: <Home />
    },
    {
      path: 'blog/:postID',
      element: <BlogPost />
    },
    {
      path: 'blog/:postID/edit',
      element: <UserAuthPageRestriction> <EditBlogPostPage /> </UserAuthPageRestriction>
    },
    {
      path: 'create',
      element: <AuthPageRestriction> <CreateBlogPost/> </AuthPageRestriction>
    }, 
    {
      path: 'myblogs',
      element: <AuthPageRestriction> <MyBlogsPage /> </AuthPageRestriction>
    }
])

export default router;