import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DeleteArticleBtn from '../DeleteArticleBtn/DeleteArticleBtn';


const ArticlesToModerateView = ({ infoMessage, setInfoMessage }) => {
    const [data, setData] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [showDeleteArticleConfirmBtn, setShowDeleteArticleConfirmBtn] = useState(false);
    const [idOfArticleToDelete, setIdOfArticleToDelete] = useState(null);
    const [arrayOfDeletedPosts, setArrayOfDeletedPosts] = useState([]);
    const [arrayOfModeratededPosts, setArrayOfModeratededPosts] = useState([]);
    const token = localStorage.getItem('token');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Groupomania - ADMIN : modération des articles';
    }, []);

    useEffect(() => {
        fetch(`/api/posts?signaled=true&moderated=false`, {
            headers: {
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then(articles => {
            setData(articles.posts);
            setUserRole(articles.user_role);
            if (articles.message) {
                setInfoMessage(articles.message);
                navigate(`/articles`);
            }
        })
        .catch(console.log('Il y a eu une erreur'))
    }, [token, setInfoMessage, navigate, arrayOfModeratededPosts]);

    const handleDelete = (id) => {
        setShowDeleteArticleConfirmBtn(true);
        setIdOfArticleToDelete(id);
    };

    const goToPageArticle = (id) => {
        navigate(`/article/${id}`);
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

    if (infoMessage) {
        setTimeout(() => {
            setInfoMessage(null);
        }, 5000);
    };

    return (
        <div className='container my-6 py-5'>
            {infoMessage && <div className='infoMessage'><p>{infoMessage}</p></div>}
        
            {!data && userRole !== 'moderator' ? 
                <button className="button is-info is-loading is-large is-outlined noborders is-block mx-auto mb-4">Loading</button>
            :
                data.map(el => {
                return  <div className="columns box is-desktop m-5 card-shadow" key={`${el.createdAt}-${el.id}`}>
                            { el.media &&
                                <div className="column is-two-fifths is-full-touch">
                                    <figure className="image media-left-widescreen">
                                        <img src={el.media} loading='lazy' alt={`Publication de ${el.user} sur Groupomania`} />
                                    </figure>
                                </div>
                            }
                            <div className="column is-flex is-flex-direction-column is-justify-content-space-around">

                                {
                                    el.content &&
                                    <div className="content mt-5 has-text-centered is-size-4 is-size-6-mobile">
                                        <p>{el.content}</p>
                                    </div>
                                }
                                <div className='mt-auto'>
                                    
                                    <div className='is-flex is-align-items-flex-end is-justify-content-flex-end my-5'>
                                        <button onClick={() => goToPageArticle(el.id)} className='button is-link is-outlined'>Voir la publication</button>
                                    </div>

                                    <div className='mt-auto is-flex is-flex-direction-column is-justify-content-space-between is-align-items-flex-end is-flex-wrap-wrap'>
                                        <div className='is-flex is-flex-wrap-wrap is-justify-content-center is-align-items-center ml-auto my-auto mt-4'>
                                            <article className="message is-danger">
                                                <div className='is-unselectable has-text-danger-dark p3 message-body is-size-6-mobile'>
                                                    <div className='is-size-7-mobile'>
                                                        <p className='is-size-7-mobile'>
                                                        <span className="icon">
                                                            <i className='fas fa-exclamation mr-2'></i>
                                                        </span>
                                                        Cette publication a été signalée pour modération.</p>
                                                        <p className='is-size-7-mobile'>En cliquant sur le bouton 'Modérer la publication' ci-dessous elle ne sera plus affichée dans le fil d'actualités.</p>
                                                        <p className='is-size-7-mobile'>Vous pouvez aussi la supprimer définitivement si cela vous semble nécessaire.</p>
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                                        <div>
                                            <button onClick={() => moderatePost(el.id)} title="Cet article n'apparaitra plus dans le fil d'actualités." className='button is-warning is-normal is-rounded py-2 px-5 my-1 mt-3 mx-4'>Modérer la publication</button>
                                        </div>
                                        {
                                            showDeleteArticleConfirmBtn &&
                                                <DeleteArticleBtn post_id={idOfArticleToDelete} showDeleteArticleConfirmBtn={showDeleteArticleConfirmBtn} setShowDeleteArticleConfirmBtn={setShowDeleteArticleConfirmBtn} setIdOfArticleToDelete={setIdOfArticleToDelete} arrayOfDeletedPosts={arrayOfDeletedPosts} setArrayOfDeletedPosts={setArrayOfDeletedPosts} pathToRedirect={location.pathname} setInfoMessage={setInfoMessage}/>
                                        }
                                        {
                                            !showDeleteArticleConfirmBtn &&
                                            <button onClick={() => handleDelete(el.id)} className='button is-danger is-outlined is-uppercase mt-5'>Supprimer cet article</button>
                                        }

                                        <div>
                                            <small className='help ml-auto mr-3'>Publiée le <em>{new Date(el.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(el.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>

                                            {
                                                el.updatedAt !== el.createdAt ?
                                                <small className='help ml-auto mr-3'>Dernière mise à jour le <em>{new Date(el.updatedAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(el.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>
                                                : null

                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                })
            }
        </div>
    )
}

export default ArticlesToModerateView
