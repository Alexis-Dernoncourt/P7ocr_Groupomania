// import { createContext, useEffect } from 'react';
// import { useLocation } from "react-router-dom";
// import { useSelector} from 'react-redux';

// export const AuthContext = createContext();

// const AuthContextProvider = props => {
//     const location = useLocation();
//     const tokenExpDate = parseInt(localStorage.getItem('expToken'));
//     const { authenticated } = useSelector((state) => state.user);

//     useEffect(() => {
//         if (new Date(tokenExpDate * 1000) <= new Date(Date.now())) {
//             localStorage.removeItem('expToken');
//             localStorage.removeItem('token');
//             localStorage.removeItem('user_id');
//         }
//         return () => {
//             return false;
//         }
//     }, [location.pathname, tokenExpDate]);

//     return (
//         <AuthContext.Provider value={authenticated}>
//             {props.children}
//         </AuthContext.Provider>
//     )

// }
// export default AuthContextProvider;
