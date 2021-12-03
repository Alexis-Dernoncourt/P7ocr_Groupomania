import { useNavigate } from "react-router-dom";
import './DeleteBtn.css';


const DeleteConfirmBtn = ({user, setUser, setShowDeleteBtn, setInfoMessage}) => {

    const navigate = useNavigate();

    const hide = () => {
        setShowDeleteBtn(false);
    };

    const deleteOk = () => {
        fetch(`http://localhost:4000/api/auth/profile-delete/${user.id}`, {
            headers: {
                'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            },
            method: 'DELETE'
        })
        .then(data => data.json())
        .then((response) => {
            setInfoMessage(response.message);
            setUser();
            localStorage.removeItem('token');
            navigate("/login");
        })
        .catch(console.log('erreur'))        
    };

    return (
        <div className="posAbsolute mb">
            <p className="alertText">Voulez-vous vraiment supprimer votre profil ?</p>
            <button className="deleteConfirmBtn oui" onClick={deleteOk}>Oui</button>
            <button className="deleteConfirmBtn non" onClick={hide}>Non</button>
        </div>
    )
}

export default DeleteConfirmBtn
