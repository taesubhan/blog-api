import {useEffect, useState} from 'react';
import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL 

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
    }
}


function useFetch(customFetch, auto=true) {
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    function fetchAPI(bodyData=null) {
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
        validateAuth();

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
    }, []);

    return {isAuth, error, loading, result, fetchAPI};
}

export function usePostFetch(apiURL, auto=false) {
    // if (!formData) return {isAuth: true, error: null, loading: false, result: null, fetchAPI: null};
    const customFetch = async (formData) => {
        return await axios.post(apiURL, formData, config);
    }
    return useFetch(customFetch, auto);
}


export function useAuthenticate() {
    const customFetch = async () => {
        const apiAuthURL = apiURL + '/authentication/verify';
        return await axios.get(apiAuthURL, config);
    }

    const {isAuth, error, loading} = useFetch(customFetch);
    return {isAuth, error, loading};
}

function filterAPI(filter) {
    const {postID} = filter;
    let apiPostUrl = apiURL + '/posts';

    if (postID) {
        return apiPostUrl + `/${postID}`;
    } else {
        return apiPostUrl;
    }
}

export function useGetPosts(filter={}) {
    const customFetch = async () => {
        const apiURLFiltered = filterAPI(filter);
        return await axios.get(apiURLFiltered)
    }
    const {result, error, loading, fetchAPI} = useFetch(customFetch);
    return {posts: result, error, loading, fetchAPI};
}


