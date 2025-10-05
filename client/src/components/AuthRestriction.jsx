import {useEffect, useState} from 'react';
import { useAuthenticate } from '../hooks/fetchAPI';


function AuthPageRestriction({children}) {
    // const [isAuth, setIsAuth] = useState(false);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const validateAuth = async () => {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
    //             }
    //         }
            
    //         try {
    //             const result = await axios.get(authURL, config);
    //             if (result.status === 200) setIsAuth(true);
    //         } catch(err) {
    //             console.log(err);
    //             setIsAuth(false);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     validateAuth();
    // }, []);

    const {isAuth, error, loading} = useAuthenticate();

    if (loading) return <div className="loading">Loading...</div>
    if (!isAuth) return <div className="authInvalid">Unauthorized page</div>
    if (error) return <div className="error">Error</div>
    return children;
}

export default AuthPageRestriction;