import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const DeleteConfirmBtn = ({user, setUser, showDeleteBtn, setShowDeleteBtn, setInfoMessage}) => {

    const {setAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    const hide = () => {
        setShowDeleteBtn(false);
    };

    const deleteOk = () => {
        fetch(`/api/user/${user.id}`, {
            headers: {
                'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            },
            method: 'DELETE'
        })
        .then(data => data.json())
        .then(response => {
            setInfoMessage(response.message);
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('expToken');
            setUser(false);
            setAuth(false);
            navigate("/login");
        })
        .catch(() => setInfoMessage('Il y a eu une erreur. Réessayez plus tard.'))        
    };

    return (
        <div className={`modal ${showDeleteBtn && 'is-flex'} `}>
            <div className="modal-background"></div>
            <div className={`modal-content ${showDeleteBtn && 'box has-background-white py-6'} `}>
                <p className="is-size-5 has-text-danger has-text-centered has-text-weight-bold mb-5">Voulez-vous vraiment supprimer votre profil ?</p>
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
