import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticlesByUserView from '../Articles/ArticlesByUserView';
import DeleteConfirmBtn from './DeleteConfirmBtn';
import './Profile.css';

const Profile = ({ infoMessage, setInfoMessage }) => {
    const [user, setUser] = useState(null);
    const [showDeleteBtn, setShowDeleteBtn] = useState(false);

    useEffect(() => {
        document.title = 'Groupomania - Votre profil';
    }, []);

    useEffect(() => {
        fetch('/api/auth/profile', {
            headers: {
                'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => { 
            setUser(data.user);
            if (!localStorage.getItem('expToken')) {
                localStorage.setItem('expToken', data.expToken);
            }
        })
        .catch(console.log('erreur'))
    }, [setUser]);


    const handleDelete = () => {
        setShowDeleteBtn(true);
    };

    if (infoMessage) {
        setTimeout(() => {
            setInfoMessage(null);
        }, 5000);
    };


    return (
        <div className='columns is-fullheight pt-6 mt-5 is-justify-content-space-around'>
            {infoMessage && <div className='infoMessage'><p>{infoMessage}</p></div>}
                {
                    !user ? 
                        <button className="button is-info is-loading is-large is-outlined noborders is-block mx-auto mb-4">Loading</button>
                    :
                    (
                        <div className='mx-5 column'>
                            <h2 className='title is-size-4-desktop is-size-5-touch has-text-centered has-text-info-dark is-uppercase mb-5'>Votre profil</h2>
                            <div className='is-flex is-flex-direction-column is-justify-content-center has-text-centered'>
                                { user.photo &&
                                    <img className='profilePicture p-0 mx-auto image' src={user.photo} alt='profile' />
                                }
                                <div className='is-flex is-flex-direction-column is-justify-content-center has-text-centered'>
                                    <p className='is-size-4-touch is-size-3-desktop has-text-weight-semibold'>{user.firstName} {user.lastName}</p>
                                    <small>mis à jour <em>{new Date(user.updatedAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(user.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>
                                    <p className=''>
                                        <Link to='/profile/update' className='button is-link is-small mt-5 is-rounded' user={user}>Mettre à jour</Link>
                                    </p>
                                </div>
                            </div>
                            <div className='is-flex is-flex-direction-column is-align-items-center is-flex-wrap-nowrap is-flex-shrink-0 mt-6'>
                                    {
                                        showDeleteBtn &&
                                        <DeleteConfirmBtn user={user} setUser={setUser} showDeleteBtn={showDeleteBtn} setShowDeleteBtn={setShowDeleteBtn} setInfoMessage={setInfoMessage} />
                                    }

                                    {
                                        !showDeleteBtn &&
                                        <button onClick={handleDelete} className='button is-rounded is-danger is-light mx-4'>Supprimer mon profil</button>

                                    }
                                {
                                user.role === 'moderator' &&
                                <div className='is-fluid mt-6'>
                                    <Link to='/admin' className='button is-primary is-medium mt-5 is-rounded is-uppercase'>Espace modération</Link>
                                </div>
                                }
                            </div>

                        </div>
                    )
                }
            <div className="column is-two-thirds">
                <h2 className='title is-size-4-desktop is-size-5-touch has-text-centered has-text-info-dark is-uppercase mb-5'>Vos publications</h2>
                <ArticlesByUserView infoMessage={infoMessage} setInfoMessage={setInfoMessage}/>
            </div>
        </div>
    )
}

export default Profile
