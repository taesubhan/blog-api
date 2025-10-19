import axios from 'axios';
import {useState} from 'react';
import {Link} from 'react-router-dom';

function SignUpSuccess() {
    return (
        <div className="signUpContainer">
            <h2 className="SignUpSuccessMessage">User has been created. Please log in</h2>
            <div className="authLink">
                <Link to='/login' className="loginLink">Login</Link>
            </div>
        </div>
    )
}

function SignUpForm({setIsSignedUp}) {
    const apiURL = import.meta.env.VITE_API_URL + '/authentication/sign-up';
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const signUpData = Object.fromEntries(formData.entries()); //Converts FormData to object {key:value}
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json' // Not needed since axios automatically assumes this based on data
                }
            }
            const result = await axios.post(apiURL, signUpData, config);
            if (result.status === 200) {
                setErrorMessage(null);
                setIsSignedUp(true);
            } else {
                alert('Unknown Error');
            }
        } catch(err) {
            setErrorMessage(err.response.data.error_message);
        }
        
        
    }

    return (
        <div className="signUpContainer authenticationContainer">
            <h2 className="signUpTitle authenticationTitle">Sign Up</h2>
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="signUpForm authenticationForm">
                <label htmlFor="fullName" className="formLabel">Full Name: </label>
                <input type="text" id="fullName" name="fullName" className="formInput" />

                <label htmlFor="userName" className="formLabel">Create Username: </label>
                <input type="text" id="userName" name="userName" className="formInput" />

                <label htmlFor="password" className="formLabel">Create Password: </label>
                <input type="password" id="password" name="password" className="formInput" />

                <label htmlFor="passwordConfirm" className="formLabel">Confirm Password: </label>
                <input type="password" id="passwordConfirm" name="passwordConfirm" className="formInput" />

                <button type="submit" className="formButton">Sign Up</button>
            </form>

            <div className="loginLinks">
                <div className="authLink">
                    <Link to='/login' className="loginLink">Login</Link>
                </div>
            </div>
        </div>
    )
}

function SignUpPage() {
    const [isSignedUp, setIsSignedUp] = useState(false);
    return (
        <>
            {isSignedUp 
                ? <SignUpSuccess />
                : <SignUpForm setIsSignedUp={setIsSignedUp} />
            }
        </>
    )
}

export default SignUpPage;