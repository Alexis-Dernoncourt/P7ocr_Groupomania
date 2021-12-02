import { useEffect } from 'react';
import LoginForm from '../LoginForm/LoginForm';

function Login() {

    useEffect(() => {
        document.title = 'Groupomania - Connexion';
    }, []);

    return (
        <div>
            < LoginForm />
        </div>
    )
}

export default Login
