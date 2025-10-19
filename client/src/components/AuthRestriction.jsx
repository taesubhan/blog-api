import { useAuthenticate } from '../hooks/fetchAPI';
import {useParams, Link} from 'react-router-dom';
import {useGetPosts} from '../hooks/fetchAPI.jsx';

function AuthPageRestriction({children}) {
    const {isAuth, error, loading} = useAuthenticate();

    if (loading) return <div className="loading">Loading...</div>
    if (!isAuth) return (
        <div className="authInvalid">
            <div className="authInvalidMessage">Unauthorized page</div>
            <Link to='/login' className="loginLink">Login</Link>
        </div>
    )
    if (error) return <div className="error">Error</div>
    return children;
}

function UserAuthRestriction() {
    const {isAuth: isTokenAuth, error: tokenError, loading: tokenLoading, result} = useAuthenticate();
    const {postID} = useParams();
    const {posts, error: getPostError, loading: getPostLoading} = useGetPosts({postID});
    let isUserAuth = false;
    if (posts && result) {
        isUserAuth = posts.author_id === result.user.userID;
    }

    return {isTokenAuth, tokenError, tokenLoading, result, isUserAuth, getPostError, getPostLoading};
}

function UserAuthPageRestriction({children}) {
    const {isTokenAuth, tokenError, tokenLoading, isUserAuth, getPostError, getPostLoading} = UserAuthRestriction();
    if (tokenLoading || getPostLoading) return <div className="loading">Loading...</div>
    if (!isTokenAuth || !isUserAuth) return (
        <div className="authInvalid">
            <div className="authInvalidMessage">Unauthorized page</div>
            <Link to='/login' className="loginLink">Login</Link>
        </div>
    )
    if (tokenError || getPostError) return <div className="error">{tokenError || getPostError}</div>

    return children;
}

function UserAuthElementRestriction({children}) {
    const {isTokenAuth, isUserAuth} = UserAuthRestriction();
    if (!isTokenAuth || !isUserAuth) return null;

    return children;
}

export {AuthPageRestriction, UserAuthPageRestriction, UserAuthElementRestriction};