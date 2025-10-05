import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
//import App from './App.jsx'
import SignUp from './pages/Sign-up.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import BlogPost from './pages/BlogPost.jsx';
import CreateBlogPost from './pages/CreateBlogPost.jsx';
import AuthPageRestriction from './components/AuthRestriction.jsx';
import './styles/sign-up.css';
import './styles/header.css';
import './styles/footer.css';
import './styles/pageStructure.css';
import './styles/home.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
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
    path: 'create',
    element: <AuthPageRestriction><CreateBlogPost/></AuthPageRestriction> //<CreateBlogPost />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
