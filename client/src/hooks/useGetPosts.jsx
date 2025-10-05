import axios from 'axios';
import {useState, useEffect} from 'react';

const apiURL = import.meta.env.VITE_API_URL + '/posts';

function filterAPI(filter) {
    const {postID} = filter;

    if (postID) {
        return apiURL + `/${postID}`;
    } else {
        return apiURL;
    }
}

function useGetPosts(filter={}) {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(true);


    const apiURLFiltered = filterAPI(filter);
    
    useEffect(() => {
        let ignore = false;
        const getAllBlogPosts = async () => {
            try {
                const response = await axios.get(apiURLFiltered);
                if (ignore) return;
                if (response.status === 200) {
                    setPosts(response.data);
                } else {
                    setError('Unknown error');
                }
            } catch(err) {
                setError(err.response.data.error_message);
            } finally {
                setLoading(false);
            }
        }

        getAllBlogPosts();

        return () => {
            ignore = true;
        }
    }, []);

    return {posts, error, loading};
}

export default useGetPosts;