import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DeleteCommentConfirmBtn from '../Comments/DeleteCommentConfirmBtn';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useGetSignaledCommentsQuery, useModerateOneCommentMutation } from '../../redux/apiSlice';

const CommentsToModerateView = () => {
    const location = useLocation();
    const [showDeleteCommentConfirmBtn, setShowDeleteCommentConfirmBtn] = useState(false);
    const { data: signaledComments, isLoading, isFetching, error, refetch } = useGetSignaledCommentsQuery();
    const { userInfos } = useSelector((state) => state.user);
    const [ moderateOneComment ] = useModerateOneCommentMutation();

    useEffect(() => {
        document.title = 'Groupomania - ADMIN : modération des commentaires';
    }, []);

    const handleModerateComment = async (el) => {
        try {
            const payload = await moderateOneComment({id: el.id, postId: el.postId}).unwrap();
            toast.success(payload.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        };
    };

    const showDeleteCommentForm = () => {
        setShowDeleteCommentConfirmBtn(true);
    };

    // if (isError && error.satus !== 404) {
    //     return (
    //         <div>
    //             <p className='has-text-centered has-text-danger-dark mb-6'>Il y a eu une erreur</p>
    //         </div>
    //     )
    // }

    return (
        <div className='container my-3 py-5'>
            {
                !error && signaledComments ?
                <p className='has-text-centered is-size-4 has-text-danger-dark mb-6'>Il y a {signaledComments.comments.count} {(signaledComments.comments.count > 1) ? 'commentaires signalés à vérifier' : 'commentaire signalé à vérifier'}</p>
                :
                <p className='has-text-centered is-size-4 has-text-danger-dark mb-6'>
                    {error?.data?.message}
                </p>
            }

            {isLoading || isFetching ?
                <LoadingSpinner />
            :
            signaledComments && !error && signaledComments.comments?.rows.map(el => {
                return  <div className="columns box is-desktop m-5 card-shadow" key={`${el.createdAt}-${el.id}`}>
                            <article className="container media">
                                <figure className="media-left">
                                    <p className="is-48x48">
                                        <img src={el.user.photo} alt='test' className='roundImg'/>
                                    </p>
                                </figure>
                                <div className="media-content">
                                    <div className="content">
                                        <div>
                                            <strong className='is-size-6 is-size-5-desktop'>{ el.userId === userInfos.id ? <span className='has-text-info is-italic'>Vous</span> : `${el.user.firstName} ${el.user.lastName}` }</strong>
                                            {
                                                el.media &&
                                                <div className='image mt-6'>
                                                    <img className='commentImg' src={el.media} alt="Gif dans un commentaire sur Groupomania" />
                                                </div>
                                            }
                                            <p className='is-size-6 is-size-5-desktop mt-5'>
                                            { el.content }
                                            </p>
                                        </div>
                                    </div>
                                    <div className='is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap'>
                                        <p className='help has-text-grey'>Dernière modification le <em>{new Date(el.updatedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(el.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></p>
                                        
                                        <div className='is-flex is-justify-content-flex-start is-flex-wrap-wrap'>

                                            <button onClick={() => handleModerateComment(el)} className='button is-light is-medium has-text-info-dark mx-4'>Modérer</button>

                                        {
                                            <>
                                            <button onClick={() => showDeleteCommentForm(el.id)} className='button is-light is-medium has-text-danger-dark mx-4'>Supprimer</button>

                                            <DeleteCommentConfirmBtn comment_id={el.id} showDeleteCommentConfirmBtn={showDeleteCommentConfirmBtn} setShowDeleteCommentConfirmBtn={setShowDeleteCommentConfirmBtn} pathToRedirect={location.pathname} refetch={refetch} />
                                            </>
                                        }
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                })
            }   
        </div>



    )
}

export default CommentsToModerateView
