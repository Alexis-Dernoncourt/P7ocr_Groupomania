import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import DeleteConfirmBtn from './DeleteConfirmBtn';
import './Profile.css';

const Profile = ({ infoMessage, setInfoMessage }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showDeleteBtn, setShowDeleteBtn] = useState(false);

    useEffect(() => {
        document.title = 'Groupomania - Votre profil';
    }, []);

    useEffect(() => {
        fetch("http://localhost:4000/api/auth/profile", {
            headers: {
                'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => { setUser(data.user) })
        .catch(console.log('erreur'))
    }, []);

    const handleClick = () => {
        setInfoMessage('Vous êtes déconnecté');
        localStorage.removeItem('token');
        navigate("/login");
    };

    const handleDelete = () => {
        setShowDeleteBtn(true);
    };

    if(infoMessage) {
        setTimeout(() => {
            setInfoMessage(null);
        }, 5000);
    };


    return (
        <div>
            {infoMessage && <div className="infoMessage"><p>{infoMessage}</p></div>}
            <div className="profileContainer">
                {
                    !user ? "Veuillez vous connecter.." :
                    (
                        <div className="contentDiv">
                            <div className="profileInfoContainer">
                                {user.photo && <img className="profilePicture" src={user.photo} alt="profile" />}
                                <div className="profileInfos">
                                    <p className="presentation">{user.firstName} {user.lastName}</p>
                                    <small>mis à jour <em>{new Date(user.updatedAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(user.updatedAt).toLocaleTimeString('fr-FR')}</em></small>
                                    <p><Link to='/profile-update' user={user}>Mettre à jour</Link></p>
                                </div>
                            </div>
                            {showDeleteBtn && <DeleteConfirmBtn user={user} setUser={setUser} setShowDeleteBtn={setShowDeleteBtn} setInfoMessage={setInfoMessage} />}
                            <button onClick={handleClick} className="logoutBtn">Me déconnecter</button>
                            <button onClick={handleDelete} className="logoutBtn deleteBtn">Supprimer mon profil</button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Profile
