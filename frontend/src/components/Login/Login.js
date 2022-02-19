import { useEffect } from 'react';
import LoginForm from '../LoginForm/LoginForm';

const Login = () => {

    useEffect(() => {
        document.title = 'Groupomania - Connexion';
    }, []);


    return (
        <div className="container">
            <LoginForm />
        </div>
    )
}

export default Login
