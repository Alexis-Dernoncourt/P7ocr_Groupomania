import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticlesByUserView from '../Articles/ArticlesByUserView';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import DeleteConfirmBtn from './DeleteConfirmBtn';
import './Profile.css';
import { useSelector} from 'react-redux';

const Profile = () => {
    const [showDeleteBtn, setShowDeleteBtn] = useState(false);
    const { userInfos, pending, error, } = useSelector((state) => state.user);

    useEffect(() => {
        document.title = 'Groupomania - Votre profil';
    }, []);

    const handleDelete = () => {
        setShowDeleteBtn(true);
    };

    if (pending) return (
        <div className="columns is-centered mx-0 mt-5">
            <LoadingSpinner />
        </div>
    )     
                        

    return (
        <>
        { error &&
            <p className='mt-5 has-text-centered has-text-danger-dark'>Il y a eu une erreur</p>
        }
        <div className='columns is-fullheight pt-6 mt-5 is-justify-content-space-around'>
                {
                    <div className='mx-5 column'>
                        <h2 className='title is-size-4-desktop is-size-5-touch has-text-centered has-text-info-dark is-uppercase mb-5'>Votre profil</h2>
                        <div className='is-flex is-flex-direction-column is-justify-content-center has-text-centered'>
                            { userInfos.photo &&
                                <img className='profilePicture p-0 mx-auto image' src={userInfos.photo} alt='profile' />
                            }
                            <div className='is-flex is-flex-direction-column is-justify-content-center has-text-centered'>
                                <p className='is-size-4-touch is-size-3-desktop has-text-weight-semibold'>{userInfos.firstName} {userInfos.lastName}</p>
                                <small>mis à jour <em>{new Date(userInfos.updatedAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(userInfos.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>
                                <p className=''>
                                    <Link to='/profile/update' className='button is-link is-small mt-5 is-rounded' user={userInfos}>Mettre à jour</Link>
                                </p>
                            </div>
                        </div>
                        <div className='is-flex is-flex-direction-column is-align-items-center is-flex-wrap-nowrap is-flex-shrink-0 mt-6'>
                                {
                                    showDeleteBtn &&
                                    <DeleteConfirmBtn user={userInfos} showDeleteBtn={showDeleteBtn} setShowDeleteBtn={setShowDeleteBtn} />
                                }

                                {
                                    !showDeleteBtn &&
                                    <button onClick={handleDelete} className='button is-rounded is-danger is-light mx-4'>Supprimer mon profil</button>

                                }
                            {
                            userInfos.role === 'moderator' &&
                            <div className='is-fluid mt-6'>
                                <Link to='/admin' className='button is-primary is-medium mt-5 is-rounded is-uppercase'>Espace modération</Link>
                            </div>
                            }
                        </div>

                    </div>

                }
            <div className="column is-two-thirds">
                <h2 className='title is-size-4-desktop is-size-5-touch has-text-centered has-text-info-dark is-uppercase mb-5'>Vos publications</h2>
                <ArticlesByUserView />
            </div>
        </div>
        </>
    )
}

export default Profile
