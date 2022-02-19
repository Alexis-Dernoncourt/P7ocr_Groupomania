import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DeleteArticleBtn from '../DeleteArticleBtn/DeleteArticleBtn';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useSelector } from 'react-redux';
import { useGetUserPostsQuery } from '../../redux/apiSlice';

const ArticlesByUserView = () => {
    const [showDeleteArticleConfirmBtn, setShowDeleteArticleConfirmBtn] = useState(false);
    const [idOfArticleToDelete, setIdOfArticleToDelete] = useState(null);
    const { userInfos } = useSelector((state) => state.user);
    const { data, isLoading, isError } = useGetUserPostsQuery(userInfos.id);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Groupomania - Votre profil`;
    }, []);

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

    if (isError) {
        return (
            <div className='my-6 has-text-centered has-text-danger-dark'>
                Il y a eu une erreur...
            </div>
        )
    }

    return (
        <div className='overflow'>
            {isLoading || !data ?
                <LoadingSpinner />
            :
                data?.posts.map(el => {
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
                                    {
                                        el.signaled && !el.moderated &&
                                        <div className='is-flex is-flex-direction-column is-align-items-flex-end is-justify-content-center mt-2 mb-5'>
                                            <p className='has-text-danger-dark has-text-weight-medium'>Votre publication a été signalée. Veuillez la modifier avant qu'elle ne soit supprimée.</p>
                                            <button onClick={() => goToUpdateView(el.id)} className='button my-3'>Modifier la publication</button>
                                        </div>
                                    }
                                    {
                                        !el.signaled && !el.moderated &&
                                        <div className='is-flex is-flex-direction-column is-align-items-flex-end is-justify-content-center mt-2 mb-5'>
                                            <button onClick={() => goToUpdateView(el.id)} className='button my-3'>Modifier la publication</button>
                                        </div>
                                    }
 
                                    {
                                        el.moderated &&
                                        <div className='is-flex is-flex-direction-column is-align-items-flex-end is-justify-content-center mt-2 mb-5'>
                                            <p className='has-text-danger-dark has-text-weight-semibold'>Votre publication a été modérée et n'apparaît plus dans le fil d'actualités. Il est inutile de la modifier, vous pouvez la supprimer.</p>
                                            <small className='has-text-link-dark is-underlined'>Veuillez consulter notre charte d'utilisation et la respecter.</small>
                                        </div>
                                    }


                                    {
                                        !el.moderated &&
                                        <div className='is-flex is-align-items-flex-end is-justify-content-flex-end my-5'>
                                            <button onClick={() => goToPageArticle(el.id)} className='button is-link is-outlined'>Voir la publication</button>
                                        </div>
                                    }
                                

                                    <div className='mt-auto is-flex is-justify-content-space-between is-align-items-flex-end is-flex-wrap-wrap'>
                                        <div>
                                            <small className='help ml-auto mr-3'>Publié le <em>{new Date(el.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(el.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>

                                            {
                                                el.updatedAt !== el.createdAt ?
                                                <small className='help ml-auto mr-3'>Dernière mise à jour le <em>{new Date(el.updatedAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(el.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></small>
                                                : null

                                            }
                                        </div>

                                        {
                                            showDeleteArticleConfirmBtn &&
                                            (userInfos.role === 'moderator' || el.userId === userInfos.id) &&
                                                <DeleteArticleBtn post_id={idOfArticleToDelete} showDeleteArticleConfirmBtn={showDeleteArticleConfirmBtn} setShowDeleteArticleConfirmBtn={setShowDeleteArticleConfirmBtn} setIdOfArticleToDelete={setIdOfArticleToDelete} pathToRedirect={location.pathname} />
                                        }
                                        {
                                            !showDeleteArticleConfirmBtn &&
                                            (userInfos.role === 'moderator' || el.userId === userInfos.id) &&
                                                <button onClick={() => handleDelete(el.id)} className='button is-danger is-inverted is-uppercase mt-5'>Supprimer cet article</button>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                })
            }
        </div>
    )
}

export default ArticlesByUserView
