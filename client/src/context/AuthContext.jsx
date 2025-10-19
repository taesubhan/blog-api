// src/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('Authorization'));
    const [userID, setUserID] = useState(localStorage.getItem('userID'));

    const login = (newToken, newUserID) => {
        setToken(newToken);
        setUserID(newUserID);
    }
    const logout = () => {
        setToken(null);
        setUserID(null);
    }

    useEffect(() => {
        if (token) {
            localStorage.setItem('Authorization', token);
        } else {
            localStorage.removeItem('Authorization');
        }
        if (userID) {
            localStorage.setItem('userID', userID);
        } else {
            localStorage.removeItem('userID');
        }

    }, [token, userID])

    return (
        <AuthContext.Provider value={{ token, userID,  login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
