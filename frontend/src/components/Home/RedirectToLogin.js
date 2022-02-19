import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const RedirectToLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/articles");
    }, [navigate]);

    return (<></>)
}

export default RedirectToLogin
