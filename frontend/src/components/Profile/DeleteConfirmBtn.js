import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector} from 'react-redux';
import { deleteUser } from '../../redux/userSlice';
import toast from 'react-hot-toast';

const DeleteConfirmBtn = ({user, showDeleteBtn, setShowDeleteBtn}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfos, fulfilled, error } = useSelector((state) => state.user);

    const hide = () => {
        setShowDeleteBtn(false);
    };

    const deleteOk = () => {
        dispatch(deleteUser(userInfos.id));
        if (error) {
            toast.error('Il y a eu une erreur. Réessayez plus tard.')
        }
        if (fulfilled) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('expToken');
            localStorage.removeItem('persist:root');
            navigate("/login");
            toast.success(`Votre profil a bien été supprimé`);
        }       
    };

    return (
        <div className={`modal ${showDeleteBtn && 'is-flex'} `}>
            <div className="modal-background"></div>
            <div className={`modal-content ${showDeleteBtn && 'box has-background-white py-6'} `}>
                <p className="is-size-5 has-text-danger has-text-centered has-text-weight-bold mb-5">Voulez-vous vraiment supprimer votre profil {user.firstName} ?</p>
                <div className="is-flex is-flex-direction-row is-justify-content-center has-text-centered">
                    <button className="button is-rounded is-danger is-outlined has-text-size-bold has-text-weight-semibold is-uppercase mx-3" onClick={deleteOk}>Oui</button>
                    <button className="button is-rounded is-primary is-outlined has-text-size-bold has-text-weight-semibold is-uppercase mx-3" onClick={hide}>Non</button>
                </div>
            </div>
            <button onClick={hide} className="modal-close is-large" aria-label="close"></button>
        </div>
    )
}

export default DeleteConfirmBtn
