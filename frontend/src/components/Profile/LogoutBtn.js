import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/userSlice';
import toast from 'react-hot-toast';
import { persistor } from '../../redux/store';

const LogoutBtn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = () => {
        persistor.purge();
        dispatch(logout());
        toast('Vous êtes déconnecté', { position: 'top-right', icon: '👏' });
        navigate("/login");
    };

    return (
        <button onClick={handleClick} className="button is-rounded is-link is-light mx-4 mt-3">Me déconnecter</button>
    )
}

export default LogoutBtn;
