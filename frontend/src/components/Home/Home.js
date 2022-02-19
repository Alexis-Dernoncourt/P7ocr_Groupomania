import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostArticleForm from '../Articles/PostArticleForm';
import CommentsComponent from '../Comments/CommentsComponent';
import PostCommentForm from '../Comments/PostCommentForm';
import DeleteArticleBtn from '../DeleteArticleBtn/DeleteArticleBtn';
import LikesComponent from '../Likes/LikesComponent';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useSelector } from 'react-redux';
import { useGetAllQuery, useSignalOnePostMutation, useModerateOnePostMutation } from '../../redux/apiSlice';
import './Home.css';
import toast from 'react-hot-toast';

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteArticleConfirmBtn, setShowDeleteArticleConfirmBtn] = useState(false);
    const [idOfArticleToDelete, setIdOfArticleToDelete] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfos } = useSelector((state) => state.user);
    const { data: posts, isLoading, isError } = useGetAllQuery();
    const [ signalOnePost ] = useSignalOnePostMutation();
    const [ moderateOnePost ] = useModerateOnePostMutation();

    useEffect(() => {
        if (showModal) {
            document.title = 'Groupomania - Ajouter une publication';
        } else {
            document.title = 'Groupomania - Accueil';
        }
    }, [showModal]);

    const signalPost = async (id) => {
        try {
            const payload = await signalOnePost(id).unwrap();
            toast.success(payload.message);
        } catch (error) {
            console.log(error);
            console.error('rejected', error.data.error);
            toast.error(error.data.message);
        };
    };

    const moderatePost = async (id) => {
        try {
            const payload = await moderateOnePost(id).unwrap();
            toast.success(payload.message);
        } catch (error) {
            console.log(error);
            console.error('rejected', error.data.error);
            toast.error(error.data.message);
        };
    };

    const showForm = () => {
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setShowDeleteArticleConfirmBtn(true);
        setIdOfArticleToDelete(id);
    };

    const goToPageArticle = (id) => {
        navigate(`/article/${id}`);
    };

    const goToUpdateView = (id) => {
        navigate(`/article/${id}/update`);
    };

    
    return (
        <div className="my-6 is-relative">
            { showModal && <PostArticleForm showModal={showModal} setShowModal={setShowModal} />}
            <h2 className='title is-size-4-desktop is-size-5-touch has-text-centered has-text-info-dark mb-2'>ARTICLES</h2>
            <div className="container is-fluid mt-5 has-background-light py-6 mt-6">
                <p className='is-size-5 is-uppercase has-text-centered pb-5'>Ajouter un nouvel article :</p>
                <div className="media-content container">
                    <div className="field">
                        <p className="control is-flex is-justify-content-center">
                            <button onClick={showForm} className="button is-success is-medium">Écrire un article</button>
                        </p>
                    </div>
                </div>
            </div>
            {
                isError &&
                <div className='my-6 has-text-danger-dark has-text-centered'>
                    <p>Il y a eu une erreur...</p>
                </div>
            }
            {
                isLoading ? 
                <div className='my-6'>
                    <LoadingSpinner />
                    <p className='has-text-centered'>Chargement...</p>
                </div>
                
                :
                posts && !isError && posts.posts.map(el => {
                    return  <div className="is-flex is-flex-direction-row is-justify-content-center mt-6" key={`${el.createdAt}-${el.id}`}>
                                <div className="box p-1 container is-max-desktop is-flex is-flex-direction-column is-align-items-center width100vw">
                                    <div className='is-clickable is-flex is-flex-direction-column is-justify-content-center container-click-article' onClick={() => goToPageArticle(el.id)}>
                                    {
                                        el.media ?
                                            (el.media.indexOf('.gif') !== -1 ) ? 
                                                <img className="postMediaGIF" src={el.media} alt="publication-media" loading='lazy' />
                                            :   
                                                <img className="postMedia" src={el.media} alt="publication-media" loading='lazy' />
                                        : null
                                    }
                                    { el.content && <p className="is-size-4 p-5 has-text-centered is-size-5-mobile">{el.content}</p> }
                                    </div>
                                    {
                                    userInfos.role === 'basic' ?
                                        el.signaled === false ?
                                            el.userId !== userInfos.id &&
                                            <button className='signalBtn mt-4' onClick={() => signalPost(el.id)}>Signaler la publication</button>
                                        :
                                            <span className='is-unselectable has-text-danger-dark p-1 ml-auto mx-4 mt-4'>La publication a été signalée</span>
                                    :
                                        el.signaled === true ?
                                            userInfos.role === 'moderator' &&
                                            <div className='is-flex is-flex-wrap-wrap is-justify-content-center is-align-items-center ml-auto my-auto mt-4'>
                                                <span className='is-unselectable has-text-danger-dark py-1 px-3 my-1 mt-3'><span className="icon"><i className='fas fa-exclamation-triangle mr-2'></i></span>La publication a été signalée</span>
                                                <button onClick={() => moderatePost(el.id)} title="Cet article n'apparaitra plus dans le fil d'actualités." className='button is-danger is-light has-text-danger-dark is-inverted is-normal is-rounded py-2 px-5 my-1 mt-3 mx-4'>Modérer la publication</button>
                                            </div>
                                        :
                                        userInfos.role === 'moderator' &&
                                        <button onClick={() => moderatePost(el.id)} title="Cet article n'apparaitra plus dans le fil d'actualités." className='button is-link is-light has-text-link-dark is-inverted is-normal is-rounded py-2 px-5 ml-auto mr-4 mt-4'>Modérer la publication</button>
                                        
                                    }
                                        
                                    {
                                        showDeleteArticleConfirmBtn &&
                                        (userInfos.role === 'moderator' || el.userId === userInfos.id) &&
                                            <DeleteArticleBtn post_id={idOfArticleToDelete} showDeleteArticleConfirmBtn={showDeleteArticleConfirmBtn} setShowDeleteArticleConfirmBtn={setShowDeleteArticleConfirmBtn} setIdOfArticleToDelete={setIdOfArticleToDelete} pathToRedirect={location.pathname} />
                                    }
                                    {
                                        !showDeleteArticleConfirmBtn &&
                                        (userInfos.role === 'moderator' || el.userId === userInfos.id) &&
                                            <div>
                                                {
                                                    el.userId === userInfos.id &&
                                                    <button onClick={() => goToUpdateView(el.id)} className='button mt-5 mx-3'>Modifier la publication</button>
                                                }
                                                <button onClick={() => handleDelete(el.id)} className='button is-danger is-inverted is-uppercase mt-5 mx-3'>Supprimer cet article</button>
                                            </div>
                                    }

                                    <span className='line'></span>
                                    <div className='is-flex is-justify-content-space-between column is-full is-full-mobile p-1'>
                                        <div className='likeContainer is-flex is-justify-content-center is-align-items-center'>
                                            <LikesComponent likes={el.likes} postId={el.id} />
                                        </div>
                                        <div className='is-flex is-justify-content-center is-align-items-center m-2'>
                                            <div className='is-flex is-flex-direction-column is-align-items-flex-end'>
                                                <p className='has-text-weight-bold is-italic m-0'>Par { el.userId === userInfos.id ? <span className='is-uppercase has-text-info is-size-5-desktop'>Vous</span> : `${el.user.firstName} ${el.user.lastName}` }</p>
                                            </div>
                                            { el.userId === userInfos.id ? 
                                                <img className="roundImg" src={userInfos.photo} alt="Auteur de la publication" />
                                            :
                                                <img className="roundImg" src={el.user.photo} alt="Auteur de la publication" />
                                            }
                                        </div>
                                    </div>
                                    <small className='help ml-auto mr-3'>Dernière mise à jour le <em>{new Date(el.updatedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(el.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>

                                    <div className='container is-fluid mt-5 has-background-light py-4 px-6'>
                                        
                                        

                                        {
                                            !el.comments.length ?
                                            <p className=' has-text-centered is-italic my-4'>Cette publication n'a pas encore de commentaire. Ajoutez-en un !</p>

                                            :
                                            <div>
                                                <p className='is-size-6 is-uppercase has-text-centered pb-5 is-underlined'>Derniers commentaires :</p>
                                                <CommentsComponent comments={el.comments} />

                                                <div className='my-4 is-flex is-align-items-flex-end'>
                                                    <button className='button has-text-link is-small ml-auto' onClick={() => goToPageArticle(el.id)}>Voir tous les commentaires</button>
                                                </div>
                                            </div>

                                        }

                                        <PostCommentForm postId={el.id} />
                                        
                                    </div>
                                </div>
                            </div>
                })
            }
        </div>
    )
}

export default Home
