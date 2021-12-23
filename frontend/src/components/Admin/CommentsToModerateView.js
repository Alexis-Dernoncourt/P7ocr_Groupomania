import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DeleteCommentConfirmBtn from '../Comments/DeleteCommentConfirmBtn';
//import { useNavigate, useLocation } from 'react-router-dom';

const CommentsToModerateView = ({ infoMessage, setInfoMessage }) => {
    const [comments, setComments] = useState([]);
    const [totalOfSignaledComments, setTotalOfSignaledComments] = useState(0);
    const [arrayOfModeratedComments, setArrayOfModeratedComments] = useState([]);
    const [idOfCommentToModerate, setIdOfCommentToModerate] = useState(0);
    const [arrayOfDeletedComments, setArrayOfDeletedComments] = useState([]);
    const [idOfCommentToDelete, setIdOfCommentToDelete] = useState(0);
    const [showDeleteCommentConfirmBtn, setShowDeleteCommentConfirmBtn] = useState(false);

    const [userRole, setUserRole] = useState('');
    const userId = parseInt(localStorage.getItem('user_id'));
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (comments.length === 1 && idOfCommentToModerate === comments[0].id) {
        setComments([]);
        setTotalOfSignaledComments(0);
        setArrayOfModeratedComments([]);
        setIdOfCommentToModerate(0)
    }

    useEffect(() => {
        document.title = 'Groupomania - ADMIN : modération des commentaires';
    }, []);

    useEffect(() => {
        fetch(`/api/comments?admin=comments`, {
            headers: {
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.comments) {
                setComments(data.comments.rows);
                setTotalOfSignaledComments(data.comments.count);
                setUserRole(data.comments.user_role);
                if (data.rows && data.count && data.message) {
                    setComments(data.rows);
                    setTotalOfSignaledComments(data.count);
                    setInfoMessage(data.comments.message);
                }
            }
        })
        .catch(console.log('Il y a eu une erreur'))
    }, [token, setInfoMessage, totalOfSignaledComments, arrayOfModeratedComments, idOfCommentToModerate, arrayOfDeletedComments, idOfCommentToDelete]);

    const handleModerateComment = (id) => {
        console.log('moderate this : ', id);
        fetch(`/api/comments/${id}?moderate=true`, {
            headers: {
                'Authorization': token
            },
            method: "PUT"
        })
        .then(res => res.json())
        .then(data => {
            setInfoMessage(data.message);
            setArrayOfModeratedComments([...arrayOfModeratedComments, id]);
            setIdOfCommentToModerate(id);
        })
        .catch(console.log('Il y a eu une erreur'))
    };

    const showDeleteCommentForm = (id) => {
        setShowDeleteCommentConfirmBtn(true);
        setIdOfCommentToDelete(id);
    };

    if (infoMessage) {
        setTimeout(() => {
            setInfoMessage(null);
        }, 5000);
    };

    return (
        <div className='container my-3 py-5'>
            {infoMessage && <div className='infoMessage'><p>{infoMessage}</p></div>}

            {
                comments &&
                <p className='has-text-centered is-size-4 has-text-danger-dark mb-6'>Il y a {totalOfSignaledComments} commentaires signalés à vérifier</p>
            }

            {!comments && userRole !== 'moderator' ? 
                <button className="button is-info is-loading is-large is-outlined noborders is-block mx-auto mb-4">Loading</button>
            :
            comments.map(el => {
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
                                            <strong className='is-size-6 is-size-5-desktop'>{ el.userId === userId ? <span className='has-text-info is-italic'>Vous</span> : `${el.user.firstName} ${el.user.lastName}` }</strong>
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

                                            <button onClick={() => handleModerateComment(el.id)} className='button is-light is-medium has-text-info-dark mx-4'>Modérer</button>

                                        {
                                            <>
                                            <button onClick={() => showDeleteCommentForm(el.id)} className='button is-light is-medium has-text-danger-dark mx-4'>Supprimer</button>

                                            <DeleteCommentConfirmBtn comment_id={el.id} showDeleteCommentConfirmBtn={showDeleteCommentConfirmBtn} setShowDeleteCommentConfirmBtn={setShowDeleteCommentConfirmBtn} setIdOfCommentToDelete={setIdOfCommentToDelete} arrayOfDeletedComments={arrayOfDeletedComments} setArrayOfDeletedComments={setArrayOfDeletedComments} pathToRedirect={location.pathname} setInfoMessage={setInfoMessage} />
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
