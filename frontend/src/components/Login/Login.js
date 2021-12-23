import { useEffect } from 'react';
import LoginForm from '../LoginForm/LoginForm';

const Login = ({ infoMessage, setInfoMessage }) => {

    useEffect(() => {
        document.title = 'Groupomania - Connexion';
    }, []);

    return (
        <div className="container">
            <LoginForm infoMessage={infoMessage} setInfoMessage={setInfoMessage} />
        </div>
    )
}

export default Login
