import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteArticleBtn from '../DeleteArticleBtn/DeleteArticleBtn';

const ArticleByIdView = ({ infoMessage, setInfoMessage }) => {
    const [article, setArticle] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [showDeleteArticleConfirmBtn, setShowDeleteArticleConfirmBtn] = useState(false);
    const [idOfArticleToDelete, setIdOfArticleToDelete] = useState(null);
    const [arrayOfSignaledPosts, setArrayOfSignaledPosts] = useState([]);
    const [arrayOfModeratededPosts, setArrayOfModeratededPosts] = useState([]);
    const [arrayOfDeletedPosts, setArrayOfDeletedPosts] = useState([]);
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('user_id'));
    const params = useParams();
    const navigate = useNavigate();
    const articleId = params.id;

    useEffect(() => {
        fetch(`/api/posts/${articleId}`, {
            headers: {
                'Authorization': token
            },
            method: 'GET'
        })
        .then(res => res.json())
        .then(article => {
            setInfoMessage(article.message);
            setArticle(article.post);
            setUserRole(article.user_role);
        })
        .catch(console.log('Il y a eu une erreur'))
    }, [token, articleId, setInfoMessage]);

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

    const handleDelete = (id) => {
        setShowDeleteArticleConfirmBtn(true);
        setIdOfArticleToDelete(id);
    };

    const goToUpdateView = (id) => {
        navigate(`/article/${id}/update`);
    };


    return (
        <div className='pt-6'>
            <div className="my-6 is-relative">
            {infoMessage && <div className='infoMessage'><p>{infoMessage}</p></div>}
            {
                !article ? 
                <div className='my-6'>
                    <button className="button is-info is-loading is-large is-outlined noborders is-block mx-auto mb-4">Loading</button>
                </div>
                :
                
                      <div className="is-flex is-flex-direction-row is-justify-content-center mt-6" key={`${article.createdAt}-${article.id}`}>
                                <div className="box p-1 container is-max-desktop is-flex is-flex-direction-column is-align-items-center">
                                    <div className='is-flex is-flex-direction-column is-justify-content-center container-click-article'>
                                    {
                                        article.media ?
                                            (article.media.indexOf('.gif') !== -1 ) ? 
                                                <img className="postMediaGIF" src={article.media} alt="publication-media" loading='lazy' />
                                            :   
                                                <img className="postMedia" src={article.media} alt="publication-media" loading='lazy' />
                                        : null
                                    }
                                    { article.content && <p className="is-size-4 p-5 has-text-centered is-size-5-mobile">{article.content}</p> }
                                    </div>
                                    {
                                    userRole === 'basic' ?
                                        article.signaled === false ?
                                            userId !== article.userId &&
                                            <button className='signalBtn mt-4' onClick={() => signalPost(article.id)}>Signaler la publication</button>
                                        :
                                            userId !== article.userId &&
                                            <span className='is-unselectable has-text-danger-dark p-1 ml-auto mx-4 mt-4'>La publication a été signalée</span>
                                    :
                                        article.signaled === true ?
                                            article.userId !== 1 &&
                                            <div className='is-flex is-flex-wrap-wrap is-justify-content-center is-align-items-center ml-auto my-auto mt-4'>
                                                <span className='is-unselectable has-text-danger-dark py-1 px-3 my-1 mt-3'><span className="icon"><i className='fas fa-exclamation-triangle mr-2'></i></span>La publication a été signalée</span>
                                                <button onClick={() => moderatePost(article.id)} title="Cet article n'apparaitra plus dans le fil d'actualités." className='button is-danger is-light has-text-danger-dark is-inverted is-normal is-rounded py-2 px-5 my-1 mt-3 mx-4'>Modérer la publication</button>
                                            </div>
                                        : 
                                        article.userId !== 1 &&
                                        <button onClick={() => moderatePost(article.id)} title="Cet article n'apparaitra plus dans le fil d'actualités." className='button is-link is-light has-text-link-dark is-inverted is-normal is-rounded py-2 px-5 ml-auto mr-4 mt-4'>Modérer la publication</button>
                                        
                                    }

                                    {
                                        (article.userId === userId) && article.signaled && !article.moderated &&
                                        <div className='is-flex is-flex-direction-column is-align-items-flex-end is-justify-content-center mt-2 mb-5'>
                                            <p className='has-text-danger-dark has-text-weight-medium'>Votre publication a été signalée. Veuillez la modifier avant qu'elle ne soit supprimée.</p>
                                            <button onClick={() => goToUpdateView(article.id)} className='button my-3'>Modifier la publication</button>
                                        </div>
                                    }
                                    {
                                        (article.userId === userId) && !article.signaled && !article.moderated &&
                                        <div className='is-flex is-flex-direction-column is-align-items-flex-end is-justify-content-center mt-2 mb-5'>
                                            <button onClick={() => goToUpdateView(article.id)} className='button my-3'>Modifier la publication</button>
                                        </div>
                                    }
 
                                    {
                                        article.moderated &&
                                        <div className='is-flex is-flex-direction-column is-align-items-flex-end is-justify-content-center mt-2 mb-5'>
                                            <p className='has-text-danger-dark has-text-weight-semibold'>Votre publication a été modérée et n'apparaît plus dans le fil d'actualités. Il est inutile de la modifier, vous pouvez la supprimer.</p>
                                            <small className='has-text-link-dark is-underlined'>Veuillez consulter notre charte d'utilisation et la respecter.</small>
                                        </div>
                                    }
                                        
                                    {
                                        showDeleteArticleConfirmBtn &&
                                        (userRole === 'moderator' || article.userId === userId) &&
                                            <DeleteArticleBtn post_id={idOfArticleToDelete} showDeleteArticleConfirmBtn={showDeleteArticleConfirmBtn} setShowDeleteArticleConfirmBtn={setShowDeleteArticleConfirmBtn} setIdOfArticleToDelete={setIdOfArticleToDelete} arrayOfDeletedPosts={arrayOfDeletedPosts} setArrayOfDeletedPosts={setArrayOfDeletedPosts} pathToRedirect={'/articles'} setInfoMessage={setInfoMessage}/>
                                    }
                                    {
                                        !showDeleteArticleConfirmBtn &&
                                        (userRole === 'moderator' || article.userId === userId) &&
                                            <button onClick={() => handleDelete(article.id)} className='button is-danger is-inverted is-uppercase mt-5'>Supprimer cet article</button>
                                    }

                                    <span className='line'></span>
                                    <div className='is-flex is-justify-content-space-between column is-full is-full-mobile p-1'>
                                        <div className='likeContainer is-flex is-justify-content-center is-align-items-center'>
                                            <span className='like'>♥</span>
                                            <span className='totalLikes'>1</span>
                                        </div>
                                        <div className='is-flex is-justify-content-center is-align-items-center m-2'>
                                            <div className='is-flex is-flex-direction-column is-align-items-flex-end'>
                                                <p className='has-text-weight-bold is-italic m-0'>Par {article.user.firstName} {article.user.lastName}</p>
                                            </div>
                                            <img className="roundImg" src={article.user.photo} alt="Auteur de la publication" />
                                        </div>
                                    </div>
                                    <small className='help ml-auto mr-3'>Postée le <em>{new Date(article.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(article.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>

                                    <small className='help ml-auto mr-3'>Dernière mise à jour le <em>{new Date(article.updatedAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(article.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>

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
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing articleit. Duis porta eros lacus, nec ultricies articleit blandit non. Suspendisse particlelentesque mauris sit amet dolor blandit rutrum. Nunc in tempus turpis.
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
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing articleit. Duis porta eros lacus, nec ultricies articleit blandit non. Suspendisse particlelentesque mauris sit amet dolor blandit rutrum. Nunc in tempus turpis.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>

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
                
            }
            </div>
        </div>
    )
}

export default ArticleByIdView
