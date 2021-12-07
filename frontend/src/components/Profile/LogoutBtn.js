import { useNavigate } from "react-router-dom";

const LogoutBtn = ({ setInfoMessage }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        setInfoMessage('Vous êtes déconnecté');
        localStorage.removeItem('token');
        navigate("/login");
    };

    return (
        <button onClick={handleClick} className="logoutBtn">Me déconnecter</button>
    )
}

export default LogoutBtn
