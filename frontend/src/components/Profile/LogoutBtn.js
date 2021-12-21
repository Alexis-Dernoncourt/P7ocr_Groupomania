import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const LogoutBtn = ({ setInfoMessage }) => {

    const navigate = useNavigate();
    const {setAuth} = useContext(AuthContext);

    const handleClick = () => {
        setInfoMessage('Vous êtes déconnecté');
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        setAuth(false);
        navigate("/login");
    };

    return (
        <button onClick={handleClick} className="button is-rounded is-link is-light mx-4 mt-3">Me déconnecter</button>
    )
}

export default LogoutBtn;
