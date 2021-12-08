import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const LogoutBtn = ({ setInfoMessage }) => {

    const navigate = useNavigate();
    const {setAuth} = useContext(AuthContext);

    const handleClick = () => {
        setInfoMessage('Vous êtes déconnecté');
        localStorage.removeItem('token');
        setAuth(false);
        navigate("/login");
    };

    return (
        <button onClick={handleClick} className="logoutBtn">Me déconnecter</button>
    )
}

export default LogoutBtn;
