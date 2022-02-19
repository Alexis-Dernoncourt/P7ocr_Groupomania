import { useEffect } from 'react';
import SignupForm from '../SignupForm/SignupForm';

const Signup = () => {

    useEffect(() => {
        document.title = 'Groupomania - Inscription';
    }, []);

    return (
        <div className="container">
            <SignupForm />
        </div>
    )
}

export default Signup
