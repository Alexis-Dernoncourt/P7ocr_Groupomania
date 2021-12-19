import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostArticleForm from '../Articles/PostArticleForm';
import DeleteArticleBtn from '../DeleteArticleBtn/DeleteArticleBtn';
import './Home.css';

const Home = ({ infoMessage, setInfoMessage }) => {
    const [data, setData] = useState(null);
    const [arrayOfSignaledPosts, setArrayOfSignaledPosts] = useState([]);
    const [arrayOfModeratededPosts, setArrayOfModeratededPosts] = useState([]);
    const [arrayOfDeletedPosts, setArrayOfDeletedPosts] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteArticleConfirmBtn, setShowDeleteArticleConfirmBtn] = useState(false);
    const [idOfArticleToDelete, setIdOfArticleToDelete] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('user_id'));

    useEffect(() => {
        if (showModal) {
            document.title = 'Groupomania - Ajouter une publication';
        } else {
            document.title = 'Groupomania - Accueil';
        }
    }, [showModal]);

    useEffect(() => {
        fetch("/api/posts", {
            headers: {
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then(data => {
            setData(data.posts);
            setUserRole(data.user_role);
        })
        .catch(console.log('Il y a eu une erreur'))
    }, [token, arrayOfSignaledPosts, arrayOfModeratededPosts, showModal, arrayOfDeletedPosts]);

    const signalPost = (id) => {
        fetch(`/api/posts/signal/${id}`, {
            headers: {
                'Authorization': token
            },
            method: "POST"
        })
        .then(res => res.json())
        .then(data => {
            setInfoMessage(data.message);
            setArrayOfSignaledPosts([...arrayOfSignaledPosts, id]);
        })
        .catch(console.log('Il y a eu une erreur'))
    };

    const moderatePost = (id) => {
        fetch(`/api/posts/moderate/${id}`, {
            headers: {
                'Authorization': token
            },
            method: "POST"
        })
        .then(res => res.json())
        .then(data => {
            setInfoMessage(data.message);
            setArrayOfModeratededPosts([...arrayOfModeratededPosts, id]);
        })
        .catch(console.log('Il y a eu une erreur'))
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

    if (infoMessage) {
        setTimeout(() => {
            setInfoMessage(null);
        }, 5000);
    };

    return (
        <div className="my-6 is-relative">
            { showModal && <PostArticleForm setInfoMessage={setInfoMessage} showModal={showModal} setShowModal={setShowModal} />}
            {infoMessage && <div className='infoMessage'><p>{infoMessage}</p></div>}
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
                !data ? 
                <div className='my-6'>
                    <button className="button is-info is-loading is-large is-outlined noborders is-block mx-auto mb-4">Loading</button>
                </div>
                :
                
                data.map(el => {
                    return  <div className="is-flex is-flex-direction-row is-justify-content-center mt-6" key={`${el.createdAt}-${el.id}`}>
                                <div className="box p-1 container is-max-desktop is-flex is-flex-direction-column is-align-items-center">
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
                                    userRole === 'basic' ?
                                        el.signaled === false ?
                                            el.userId !== userId &&
                                            <button className='signalBtn mt-4' onClick={() => signalPost(el.id)}>Signaler la publication</button>
                                        :
                                            <span className='is-unselectable has-text-danger-dark p-1 ml-auto mx-4 mt-4'>La publication a été signalée</span>
                                    :
                                        el.signaled === true ?
                                            el.userId !== 1 &&
                                            <div className='is-flex is-flex-wrap-wrap is-justify-content-center is-align-items-center ml-auto my-auto mt-4'>
                                                <span className='is-unselectable has-text-danger-dark py-1 px-3 my-1 mt-3'><span className="icon"><i className='fas fa-exclamation-triangle mr-2'></i></span>La publication a été signalée</span>
                                                <button onClick={() => moderatePost(el.id)} title="Cet article n'apparaitra plus dans le fil d'actualités." className='button is-danger is-light has-text-danger-dark is-inverted is-normal is-rounded py-2 px-5 my-1 mt-3 mx-4'>Modérer la publication</button>
                                            </div>
                                        :
                                        el.userId !== 1 &&
                                        <button onClick={() => moderatePost(el.id)} title="Cet article n'apparaitra plus dans le fil d'actualités." className='button is-link is-light has-text-link-dark is-inverted is-normal is-rounded py-2 px-5 ml-auto mr-4 mt-4'>Modérer la publication</button>
                                        
                                    }
                                        
                                    {
                                        showDeleteArticleConfirmBtn &&
                                        (userRole === 'moderator' || el.userId === userId) &&
                                            <DeleteArticleBtn post_id={idOfArticleToDelete} showDeleteArticleConfirmBtn={showDeleteArticleConfirmBtn} setShowDeleteArticleConfirmBtn={setShowDeleteArticleConfirmBtn} setIdOfArticleToDelete={setIdOfArticleToDelete} arrayOfDeletedPosts={arrayOfDeletedPosts} setArrayOfDeletedPosts={setArrayOfDeletedPosts} pathToRedirect={location.pathname} setInfoMessage={setInfoMessage}/>
                                    }
                                    {
                                        !showDeleteArticleConfirmBtn &&
                                        (userRole === 'moderator' || el.userId === userId) &&
                                            <div>
                                                {
                                                    el.userId === userId &&
                                                    <button onClick={() => goToUpdateView(el.id)} className='button mt-5 mx-3'>Modifier la publication</button>
                                                }
                                                <button onClick={() => handleDelete(el.id)} className='button is-danger is-inverted is-uppercase mt-5 mx-3'>Supprimer cet article</button>
                                            </div>
                                    }

                                    <span className='line'></span>
                                    <div className='is-flex is-justify-content-space-between column is-full is-full-mobile p-1'>
                                        <div className='likeContainer is-flex is-justify-content-center is-align-items-center'>
                                            <span className='like'>♥</span>
                                            <span className='totalLikes'>1</span>
                                        </div>
                                        <div className='is-flex is-justify-content-center is-align-items-center m-2'>
                                            <div className='is-flex is-flex-direction-column is-align-items-flex-end'>
                                                <p className='has-text-weight-bold is-italic m-0'>Par { el.userId === userId ? <span className='is-uppercase has-text-info is-size-5-desktop'>Vous</span> : `${el.user.firstName} ${el.user.lastName}` }</p>
                                            </div>
                                            <img className="roundImg" src={el.user.photo} alt="Auteur de la publication" />
                                        </div>
                                    </div>
                                    <small className='help ml-auto mr-3'>Dernière mise à jour le <em>{new Date(el.updatedAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(el.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>

                                    <div className='container is-fluid mt-5 has-background-light py-4'>
                                        <p className='is-size-6 is-uppercase has-text-centered pb-5 is-underlined'>Derniers commentaires :</p>
                                        <article className="media">
                                            <figure className="media-left">
                                                <p className="image is-48x48 mt-3">
                                                    <img src="https://bulma.io/images/placeholders/128x128.png" alt='test' />
                                                </p>
                                            </figure>
                                            <div className="media-content">
                                                <div className="content">
                                                    <div>
                                                        <strong className='is-size-7 is-size-6-desktop'>Barbara Middleton</strong>
                                                        <p className='is-size-7 is-size-6-desktop'>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis porta eros lacus, nec ultricies elit blandit non. Suspendisse pellentesque mauris sit amet dolor blandit rutrum. Nunc in tempus turpis.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>

                                        <article className="media">
                                            <figure className="media-left">
                                                <p className="image is-48x48 mt-3">
                                                    <img src="https://bulma.io/images/placeholders/128x128.png" alt='test' />
                                                </p>
                                            </figure>
                                            <div className="media-content">
                                                <div className="content">
                                                    <div>
                                                        <strong className='is-size-7 is-size-6-desktop'>John Mire</strong>
                                                        <p className='is-size-7 is-size-6-desktop'>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis porta eros lacus, nec ultricies elit blandit non. Suspendisse pellentesque mauris sit amet dolor blandit rutrum. Nunc in tempus turpis.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>

                                        <div className='my-4 is-flex is-align-items-flex-end'>
                                            <button className='button has-text-link is-small ml-auto' onClick={() => goToPageArticle(el.id)}>Voir tous les commentaires</button>
                                        </div>

                                        <article className="media is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
                                            <div>
                                                <p className='is-size-6 has-text-centered pb-2'>Ajouter un commentaire :</p>
                                            </div>
                                            <div className="media container is-fluid is-flex is-flex-direction-row is-align-items-start">
                                                <figure className="media-left">
                                                    <p className="image is-48x48">
                                                        <img src="https://bulma.io/images/placeholders/128x128.png" alt='test' />
                                                    </p>
                                                </figure>
                                                <div className="media-content">
                                                    <div className="field">
                                                        <p className="control">
                                                            <textarea className="textarea" cols='30' rows='2' placeholder="Add a comment..."></textarea>
                                                        </p>
                                                    </div>
                                                    <div className="field">
                                                        <p className="control">
                                                            <button className="button">Post comment</button>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                        
                                    </div>
                                </div>
                            </div>
                
                })
            }
        </div>
    )
}

export default Home
