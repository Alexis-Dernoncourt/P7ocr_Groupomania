import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const RedirectToLogin = () => {

    const navigate = useNavigate();

    useEffect(() => {
        navigate("/home");
    }, [navigate]);

    return (
        <div>
        </div>
    )
}

export default RedirectToLogin
