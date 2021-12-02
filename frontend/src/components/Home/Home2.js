import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Home2() {

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
