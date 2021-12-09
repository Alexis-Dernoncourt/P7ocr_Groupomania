import { useEffect } from 'react';
import LoginForm from '../LoginForm/LoginForm';

const Login = ({ infoMessage, setInfoMessage }) => {

    useEffect(() => {
        document.title = 'Groupomania - Connexion';
    }, []);

    return (
        <div>
            < LoginForm infoMessage={infoMessage} setInfoMessage={setInfoMessage} />
        </div>
    )
}

export default Login
