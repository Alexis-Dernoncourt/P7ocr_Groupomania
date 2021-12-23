import { createContext, useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";


export const AuthContext = createContext();

const AuthContextProvider = props => {
    const location = useLocation();
    const tokenExpDate = parseInt(localStorage.getItem('expToken'));

    useEffect(() => {
        if (new Date(tokenExpDate * 1000) <= new Date(Date.now())) {
            setAuth(false);
            localStorage.removeItem('expToken');
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
        }
        return () => {
            return false;
        }
    }, [location.pathname, tokenExpDate]);

    const [auth, setAuth] = useState(localStorage.getItem('token') ? true : false);

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {props.children}
        </AuthContext.Provider>
    )

}
export default AuthContextProvider;
