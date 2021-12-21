import { createContext, useState } from 'react'

export const AuthContext = createContext();

const AuthContextProvider = props => {
    const [auth, setAuth] = useState(localStorage.getItem('token') ? true : false);

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {props.children}
        </AuthContext.Provider>
    )

}
export default AuthContextProvider;
