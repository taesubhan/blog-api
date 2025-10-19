import axios from 'axios';
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuthContext} from '../context/AuthContext';

function LoginForm() {
    const apiURL = import.meta.env.VITE_API_URL + '/authentication/login';
    const [errorMessage, setErrorMessage] = useState(null);
    const {login} = useAuthContext();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const loginInput = Object.fromEntries(formData.entries());

        const config = {
            headers: {
                'Content-Type': 'application/json' 
            }
        }

        try {
            const result = await axios.post(apiURL, loginInput, config);
            if (result.status === 200) {
                setErrorMessage(null);
                // localStorage.setItem('Authorization', result.data.token);
                // localStorage.setItem('userID', result.data.userID);
                login(result.data.token, result.data.userID)
                // window.location.href = '/home';
                navigate('/home');
            }

        } catch(err) {
            setErrorMessage(err.response.data.error_message);
        }
        
    }

    return (
        <div className="loginContainer authenticationContainer">
            <h2 className="loginTitle authenticationTitle">Login</h2>
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="loginForm authenticationForm">
                <label htmlFor="userName" className="formLabel">Username: </label>
                <input type="text" id="userName" name="userName" className="formInput" />

                <label htmlFor="password" className="formLabel">Password: </label>
                <input type="password" id="password" name="password" className="formInput" />

                <button type="submit" className="formButton">Login</button>
            </form>

            <div className="loginLinks">
                <div className="authLink">
                    <Link to='/signup' className="signupLink">Don't have an account</Link>
                </div>
                <div className="guestLink">
                    <Link to='/home' className="guestAccess">Continue as guest</Link>
                </div>
            </div>
        </div>
    )
}

function LoginPage() {
    return (
        <LoginForm />
    )
}

export default LoginPage;