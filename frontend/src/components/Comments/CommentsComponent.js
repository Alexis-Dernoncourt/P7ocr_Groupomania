import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ModifyCommentForm from './ModifyCommentForm';
import DeleteCommentConfirmBtn from './DeleteCommentConfirmBtn';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import toast from 'react-hot-toast';
import { useSignalOneCommentMutation } from '../../redux/apiSlice';

const CommentsComponent = ({ comments }) => {
    const location = useLocation();
    const [commentToModify, setCommentToModify] = useState({});
    const [idOfCommentToDelete, setIdOfCommentToDelete] = useState(null);
    const { userInfos } = useSelector((state) => state.user);
    const [commentsData, setCommentsData] = useState([]);
    const [showModifyForm, setShowModifyForm] = useState(false);
    const [showDeleteCommentConfirmBtn, setShowDeleteCommentConfirmBtn] = useState(false);
    const [ signalOneComment ] = useSignalOneCommentMutation();
    
    useEffect(() => {
        if (comments.length > 0) {
            const commentsCopy = [...comments];
            const sortedComments = commentsCopy.sort((a, b) => a.id - b.id);
            setCommentsData(sortedComments);
        }
    }, [comments]);

    const signalComment = async (el) => {
        try {
            const payload = await signalOneComment({id: el.id, postId: el.postId}).unwrap();
            toast.success(payload.message);
        } catch (error) {
            console.log(error);
            toast.error(error.data.message);
        };
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

            commentsData && commentsData.map((el, i) => {
                return  <article className="container media" key={`${el.id}-${i}`}>
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
                                        el.userId === userInfos.id && !showModifyForm &&
                                        <button onClick={() => showModifyFormComment(el)} className='button is-light is-small has-text-info-dark mx-4'>Modifier</button>
                                        
                                    }

                                    {
                                        (el.userId === userInfos.id || userInfos.role === 'moderator') &&
                                        <>
                                        <button onClick={() => showDeleteCommentConfirm(el.id)} className='button is-light is-small has-text-danger-dark mx-4'>Supprimer</button>

                                        <DeleteCommentConfirmBtn comment_id={idOfCommentToDelete} showDeleteCommentConfirmBtn={showDeleteCommentConfirmBtn} setShowDeleteCommentConfirmBtn={setShowDeleteCommentConfirmBtn} pathToRedirect={location.pathname} />
                                        </>
                                    }

                                    {
                                    el.signaled === null ?
                                        (el.userId !== userInfos.id && userInfos.role !== 'moderator') &&
                                        <button onClick={() => signalComment(el)} className='button is-light is-small has-text-info-dark mx-4'>Signaler</button>
                                    :
                                        <span className='is-unselectable has-text-danger-dark ml-auto'>Ce commentaire a été signalé</span>
                                    }

                                    </div>
                                </div>
                                {
                                    showModifyForm && commentToModify.id === el.id &&
                                    <ModifyCommentForm commentId={el.id} setShowModifyForm={setShowModifyForm} commentToModify={commentToModify} setCommentToModify={setCommentToModify} />
                                }
                            </div>
                        </article>
                })
            }
        </div>
    )
}

export default CommentsComponent
