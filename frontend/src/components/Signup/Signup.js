import { useEffect } from 'react';
import SignupForm from '../SignupForm/SignupForm';

const Signup = ({ setInfoMessage }) => {

    useEffect(() => {
        document.title = 'Groupomania - Inscription';
    }, []);

    return (
        <div className="container">
            <SignupForm setInfoMessage={setInfoMessage} />
        </div>
    )
}

export default Signup
