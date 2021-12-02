import { useEffect } from 'react';
import SignupForm from '../SignupForm/SignupForm';

function Signup() {

    // const [data, setData] = useState(null);

    // useEffect(() => {
    //     fetch("/api/auth/signup")
    //     .then(res => res.json())
    //     .then(data => setData(data.message))
    //     .catch(console.log('erreur'))
    // }, [data]);

    useEffect(() => {
        document.title = 'Groupomania - Inscription';
    }, []);

    return (
        <div>
            < SignupForm />
        </div>
    )
}

export default Signup
