import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Home2 = () => {

    const navigate = useNavigate();

    useEffect(() => {
        navigate("/login");
    }, [navigate]);

    return (
        <div>
        </div>
    )
}

export default Home2