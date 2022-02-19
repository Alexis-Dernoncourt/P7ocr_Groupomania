import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DeleteArticleBtn from '../DeleteArticleBtn/DeleteArticleBtn';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useGetSignaledPostsQuery, useModerateOnePostMutation } from '../../redux/apiSlice';
import toast from 'react-hot-toast';

const ArticlesToModerateView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showDeleteArticleConfirmBtn, setShowDeleteArticleConfirmBtn] = useState(false);
    const [idOfArticleToDelete, setIdOfArticleToDelete] = useState(null);
    const { data: signaledPosts, isLoading } = useGetSignaledPostsQuery();
    const [ moderateOnePost ] = useModerateOnePostMutation();

    useEffect(() => {
        document.title = 'Groupomania - ADMIN : modération des articles';
    }, []);

    const handleDelete = (id) => {
        setShowDeleteArticleConfirmBtn(true);
        setIdOfArticleToDelete(id);
    };

    const goToPageArticle = (id) => {
        navigate(`/article/${id}`);
    };

    const moderatePost = async (id) => {
        try {
            const payload = await moderateOnePost(id).unwrap();
            toast.success(payload.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        };
    };

    return (
        <div className='container my-3 py-5'>       
            {!signaledPosts || signaledPosts.posts?.length === 0 ?
                <>
                { isLoading && <LoadingSpinner /> }
                <p className='has-text-centered is-size-4 has-text-danger-dark'>
                    Il n'y a pas d'articles signalés.
                </p>
                </>
            :
            signaledPosts.posts?.map(el => {
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
                                                <DeleteArticleBtn post_id={idOfArticleToDelete} showDeleteArticleConfirmBtn={showDeleteArticleConfirmBtn} setShowDeleteArticleConfirmBtn={setShowDeleteArticleConfirmBtn} setIdOfArticleToDelete={setIdOfArticleToDelete} pathToRedirect={location.pathname} />
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
