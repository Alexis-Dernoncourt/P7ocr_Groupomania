import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentsComponent from '../Comments/CommentsComponent';
import DeleteArticleBtn from '../DeleteArticleBtn/DeleteArticleBtn';
import PostCommentForm from '../Comments/PostCommentForm';
import LikesComponent from '../Likes/LikesComponent';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useGetOnePostQuery, useSignalOnePostMutation, useModerateOnePostMutation } from '../../redux/apiSlice';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ArticleByIdView = () => {
    const [showDeleteArticleConfirmBtn, setShowDeleteArticleConfirmBtn] = useState(false);
    const [idOfArticleToDelete, setIdOfArticleToDelete] = useState(null);
    const params = useParams();
    const articleId = params.id;
    const navigate = useNavigate();
    const { userInfos } = useSelector((state) => state.user);
    const { data, isLoading, isError } = useGetOnePostQuery(articleId);
    const article = data?.post;
    const [ signalOnePost ] = useSignalOnePostMutation();
    const [ moderateOnePost ] = useModerateOnePostMutation();

    useEffect(() => {
        document.title = `Groupomania - Article ${articleId}`;
    }, [articleId]);

    const signalPost = async (id) => {
        try {
            const payload = await signalOnePost(id).unwrap();
            toast.success(payload.message);
        } catch (error) {
            console.log(error);
            toast.error(error.data.message);
        };
    };

    const moderatePost = async (id) => {
        try {
            const payload = await moderateOnePost(id).unwrap();
            toast.success(payload.message);
        } catch (error) {
            console.log(error);
            toast.error(error.data.message);
        };
    };

    const handleDelete = (id) => {
        setShowDeleteArticleConfirmBtn(true);
        setIdOfArticleToDelete(id);
    };

    const goToUpdateView = (id) => {
        navigate(`/article/${id}/update`);
    };

    if (isError) {
        return (
            <div className='my-6 has-text-centered has-text-danger-dark'>
                Il y a eu une erreur...
            </div>
        )
    }

    return (
        <div className='pt-6'>
            <div className="my-6 is-relative">
            {
                isLoading ? 
                <div className='my-6'>
                    <LoadingSpinner />
                </div>
                :
                
                      <div className="is-flex is-flex-direction-row is-justify-content-center mt-6" key={`${article.createdAt}-${article.id}`}>
                                <div className="box p-1 container is-max-desktop is-flex is-flex-direction-column is-align-items-center width100vw">
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
                                    userInfos.role === 'basic' ?
                                        article.signaled === false ?
                                            userInfos.id !== article.userId &&
                                            <button className='signalBtn mt-4' onClick={() => signalPost(article.id)}>Signaler la publication</button>
                                        :
                                            userInfos.id !== article.userId &&
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
                                        (article.userId === userInfos.id) && article.signaled && !article.moderated &&
                                        <div className='is-flex is-flex-direction-column is-align-items-flex-end is-justify-content-center mt-2 mb-5'>
                                            <p className='has-text-danger-dark has-text-weight-medium'>Votre publication a été signalée. Veuillez la modifier avant qu'elle ne soit supprimée.</p>
                                            <button onClick={() => goToUpdateView(article.id)} className='button my-3'>Modifier la publication</button>
                                        </div>
                                    }
                                    {
                                        (article.userId === userInfos.id) && !article.signaled && !article.moderated &&
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
                                        (userInfos.role === 'moderator' || article.userId === userInfos.id) &&
                                            <DeleteArticleBtn post_id={idOfArticleToDelete} showDeleteArticleConfirmBtn={showDeleteArticleConfirmBtn} setShowDeleteArticleConfirmBtn={setShowDeleteArticleConfirmBtn} setIdOfArticleToDelete={setIdOfArticleToDelete} pathToRedirect={'/articles'} />
                                    }
                                    {
                                        !showDeleteArticleConfirmBtn &&
                                        (userInfos.role === 'moderator' || article.userId === userInfos.id) &&
                                            <button onClick={() => handleDelete(article.id)} className='button is-danger is-inverted is-uppercase mt-5'>Supprimer cet article</button>
                                    }

                                    <span className='line'></span>
                                    <div className='is-flex is-justify-content-space-between column is-full is-full-mobile p-1'>
                                        <div className='likeContainer is-flex is-justify-content-center is-align-items-center'>
                                            <LikesComponent likes={article.likes} postId={article.id} />
                                        </div>
                                        <div className='is-flex is-justify-content-center is-align-items-center m-2'>
                                            <div className='is-flex is-flex-direction-column is-align-items-flex-end'>
                                                <p className='has-text-weight-bold is-italic m-0'>Par { article.userId === userInfos.id ? <span className='is-uppercase has-text-info is-size-5-desktop'>Vous</span> : `${article.user.firstName} ${article.user.lastName}` }</p>
                                            </div>
                                            <img className="roundImg" src={article.user.photo} alt="Auteur de la publication" />
                                        </div>
                                    </div>
                                    <small className='help ml-auto mr-3'>Posté le <em>{new Date(article.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(article.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>

                                    <small className='help ml-auto mr-3'>Dernière mise à jour le <em>{new Date(article.updatedAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(article.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>

                                    <div className='container is-fluid mt-5 has-background-light py-4'>
                                        
                                        {
                                            !article.comments.length ?
                                            <p className=' has-text-centered is-italic my-4'>Cette publication n'a pas encore de commentaire. Ajoutez-en un !</p>

                                            :
                                            <div>
                                                <p className='is-size-6 is-uppercase has-text-centered pb-5 is-underlined'>Derniers commentaires :</p>
                                                <CommentsComponent comments={article.comments} />
                                            </div>

                                        }

                                        <PostCommentForm postId={article.id} />
                                        
                                    </div>
                                </div>
                            </div>
                
            }
            </div>
        </div>
    )
}

export default ArticleByIdView
