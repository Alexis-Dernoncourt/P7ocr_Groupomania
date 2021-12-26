import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ModifyCommentForm from './ModifyCommentForm';
import DeleteCommentConfirmBtn from './DeleteCommentConfirmBtn';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const CommentsComponent = ({ comments, arrayOfSignaledComments, setArrayOfSignaledComments, arrayOfDeletedComments, setArrayOfDeletedComments, userRole, arrayOfNewComment, setArrayOfNewComment, commentToModify, setCommentToModify, idOfCommentToDelete, setIdOfCommentToDelete, setInfoMessage }) => {
    const userId = parseInt(localStorage.getItem('user_id'));
    const [commentsData, setCommentsData] = useState([]);
    const [showModifyForm, setShowModifyForm] = useState(false);
    const [showDeleteCommentConfirmBtn, setShowDeleteCommentConfirmBtn] = useState(false);
    const token = localStorage.getItem('token');
    const location = useLocation();
    
    useEffect(() => {
        setCommentsData(comments);
    }, [comments, arrayOfSignaledComments]);

    const signalComment = (id) => {
        fetch(`/api/comments/${id}?signal=true`, {
            headers: {
                'Authorization': token
            },
            method: "PUT"
        })
        .then(res => res.json())
        .then(data => {
            setArrayOfSignaledComments([...arrayOfSignaledComments, id]);
            setInfoMessage(data.message);
        })
        .catch(console.log('Il y a eu une erreur'))
    };

    const showDeleteCommentConfirm = (id) => {
        setShowDeleteCommentConfirmBtn(true);
        setIdOfCommentToDelete(id);
    };

    const showModifyFormComment = (el) => {
        setShowModifyForm(true);
        setCommentToModify(el);
    };

    return (
        <div>

            {
                !commentsData ?
                <div className='my-6'>
                    <LoadingSpinner />
                </div>

                :

                commentsData
                .sort((a, b) => a.id - b.id)
                .map((el, i) => {
                    return  <article className="container media" key={`${el.id}-${i}`}>
                                <figure className="media-left">
                                    <p className="is-48x48">
                                        <img src={el.user.photo} alt='test' className='roundImg'/>
                                    </p>
                                </figure>
                                <div className="media-content">
                                    <div className="content">
                                        <div>
                                            <strong className='is-size-6 is-size-5-desktop'>{ el.userId === userId ? <span className='has-text-info is-italic'>Vous</span> : `${el.user.firstName} ${el.user.lastName}` }</strong>
                                            {
                                                el.media &&
                                                <div className='image'>
                                                    <img className='commentImg' src={el.media} alt="Gif dans un commentaire sur Groupomania" />
                                                </div>
                                            }
                                            <p className='is-size-6 is-size-5-desktop'>
                                            { el.content }
                                            </p>
                                        </div>
                                    </div>
                                    <div className='is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap'>
                                        <p className='help has-text-grey'>Dernière modification le <em>{new Date(el.updatedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(el.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</em></p>
                                        
                                        <div className='is-flex is-justify-content-flex-start is-flex-wrap-wrap'>

                                        {
                                            el.userId === userId && !showModifyForm &&
                                            <button onClick={() => showModifyFormComment(el)} className='button is-light is-small has-text-info-dark mx-4'>Modifier</button>
                                            
                                        }

                                        {
                                            (el.userId === userId || userRole === 'moderator') &&
                                            <>
                                            <button onClick={() => showDeleteCommentConfirm(el.id)} className='button is-light is-small has-text-danger-dark mx-4'>Supprimer</button>

                                            <DeleteCommentConfirmBtn comment_id={idOfCommentToDelete} showDeleteCommentConfirmBtn={showDeleteCommentConfirmBtn} setShowDeleteCommentConfirmBtn={setShowDeleteCommentConfirmBtn} arrayOfDeletedComments={arrayOfDeletedComments} setArrayOfDeletedComments={setArrayOfDeletedComments} pathToRedirect={location.pathname} setInfoMessage={setInfoMessage} />
                                            </>
                                        }

                                        {
                                        el.signaled === null ?
                                            (el.userId !== userId || userRole !== 'moderator') &&
                                            <button onClick={() => signalComment(el.id)} className='button is-light is-small has-text-info-dark mx-4'>Signaler</button>
                                        :
                                            <span className='is-unselectable has-text-danger-dark ml-auto'>Ce commentaire a été signalé</span>
                                        }

                                        </div>
                                    </div>
                                    {
                                        showModifyForm && commentToModify.id === el.id &&
                                        <ModifyCommentForm commentId={el.id} setShowModifyForm={setShowModifyForm} commentToModify={commentToModify} setCommentToModify={setCommentToModify} arrayOfNewComment={arrayOfNewComment} setArrayOfNewComment={setArrayOfNewComment} setInfoMessage={setInfoMessage} />
                                    }
                                </div>
                            </article>
                })
            }
            
        </div>
    )
}

export default CommentsComponent
