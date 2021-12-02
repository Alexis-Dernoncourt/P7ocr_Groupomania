import { useNavigate } from "react-router-dom";
import './DeleteBtn.css';


function DeleteConfirmBtn({user, setUser, setShowDeleteBtn}) {

    const navigate = useNavigate();

    const hide = () => {
        setShowDeleteBtn(false);
    };

    const deleteOk = () => {
        console.log('delete the user now', user);
        fetch(`http://localhost:4000/api/auth/profile-delete/${user.id}1110`, {
            headers: {
                'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            },
            method: 'DELETE'
        })
        .then(() => {
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
