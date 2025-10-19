import {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuthContext} from '../context/AuthContext';

const apiURL = import.meta.env.VITE_API_URL 

function getConfig(token) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
}


function useFetch(customFetch, auto=true, dep) {
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    async function fetchAPI(bodyData=null) {
        let ignore = false;
        const validateAuth = async () => {
            try {
                if (ignore) return;
                const fetchResult = bodyData ? await customFetch(bodyData) : await customFetch();
                if (fetchResult && fetchResult.status === 200) {
                    setIsAuth(true);
                    setResult(fetchResult.data);
                }
            } catch(err) {
                setError(err);
                // setError(err.response.data.error_message);
            } finally {
                setLoading(false);
            }
        }
        await validateAuth();

        return () => {
            ignore = true;
        }
    }

    useEffect(() => {
        if (auto) {
            fetchAPI();
        } else {
            setLoading(false);
        }
    }, [auto, dep]);

    return {isAuth, error, loading, result, fetchAPI};
}

export function usePostFetch(apiURL, auto=false) {
    const {token} = useAuthContext();
    // if (!formData) return {isAuth: true, error: null, loading: false, result: null, fetchAPI: null};
    const customFetch = async (formData) => {
        const config = getConfig(token);
        return await axios.post(apiURL, formData, config);
    }
    return useFetch(customFetch, auto);
}

export function useEditFetch(apiURL, auto=false) {
    const {token} = useAuthContext();

    const customFetch = async (formData) => {
        const config = getConfig(token);
        return await axios.put(apiURL, formData, config);
    }
    return useFetch(customFetch, auto);
}


export function useAuthenticate(dep=null) {
    const {token} = useAuthContext();

    const customFetch = async () => {
        const config = getConfig(token);
        const apiAuthURL = apiURL + '/authentication/verify';
        return await axios.get(apiAuthURL, config);
    }

    const {isAuth, error, loading , result, fetchAPI} = useFetch(customFetch, true, dep);
    return {isAuth, error, loading, result, fetchAPI};
}

// export function useAuthVerify(dep=null) {
//     const customFetch = async (token) => {
//         const apiAuthURL = apiURL + '/authentication/verify';
//         return await axios.get(apiAuthURL, config);
//     }

//     const {isAuth, error, loading , result, fetchAPI} = useFetch(customFetch, true, dep);
//     return {isAuth, error, loading, result, fetchAPI};
// }

// export function useAuthLogIn() {
//     const result = 
//     const customFetch = async () => {
//         const apiAuthURL = apiURL + '/authentication/verify';
//         return await await axios.post(apiURL, loginInput, config);
//     }

//     const {isAuth, error, loading , result, fetchAPI} = useFetch(customFetch, true, dep);
//     return {isAuth, error, loading, result, fetchAPI};
// }

function filterAPI(filter) {
    const {postID, userID, searchText} = filter;
    let baseUrl = apiURL + '/posts';

    if (postID) {
        return baseUrl + `/${postID}`;
    } 
    
    const params = new URLSearchParams();

    if (userID) {
        params.append('userid', userID);
    } 
    if (searchText) {
        params.append('search', searchText);
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export function useGetPosts(filter={}, auto=true, dep=null) {
    const customFetch = async () => {
        const apiURLFiltered = filterAPI(filter);
        return await axios.get(apiURLFiltered)
    }
    const {result, error, loading} = useFetch(customFetch, auto, dep);

    return {posts: result, error, loading};
}

export function useDeletePost(auto=false) {
    const {token} = useAuthContext();

    const customFetch = async (postID) => {
        const config = getConfig(token);
        const apiDeleteUrl = apiURL + `/posts/${postID}`
        return await axios.delete(apiDeleteUrl, config);
    }
    const {result, error, loading, fetchAPI} = useFetch(customFetch, auto);
    return {posts: result, error, loading, fetchAPI};
}

export function useGetComments(filter={}, auto=true, dep=null) {
    const customFetch = async () => {
        const apiURLFiltered = filterAPI(filter) + '/comments';
        return await axios.get(apiURLFiltered)
    }
    const {result, error, loading, fetchAPI} = useFetch(customFetch, auto, dep);
    return {comments: result, error, loading, fetchAPI};
}

export function usePostComment(apiURL, auto=false) {
    const {token} = useAuthContext();

    const customFetch = async (formData) => {
        const config = getConfig(token);
        return await axios.post(apiURL, formData, config);
    }
    return useFetch(customFetch, auto);
}

export function useDeleteComment(auto=false) {
    const {token} = useAuthContext();

    const customFetch = async (commentID) => {
        const config = getConfig(token);
        const apiDeleteUrl = apiURL + `/posts/comments/${commentID}`
        return await axios.delete(apiDeleteUrl, config);
    }
    const {result, error, loading, fetchAPI} = useFetch(customFetch, auto);
    return {comment: result, error, loading, fetchAPI};
}