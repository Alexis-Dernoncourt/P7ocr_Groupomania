import { useState } from 'react';
import match from '../../utils/regex';

const PostCommentForm = ({ postId, arrayOfNewComment, setArrayOfNewComment, setInfoMessage }) => {
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('user_id'));
    const [content, setContent] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [contentError, setContentError] = useState('');
    const [imgLinkError, setImgLinkError] = useState('');

    const postComment = () => {
        const body = {
            "content": content,
            "imgLink": imgLink,
            "userId": userId,
            "postId": postId
        };

        fetch(`/api/comments`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(postedComment => {
            setContent('');
            setImgLink('');
            setArrayOfNewComment(...arrayOfNewComment, content);
            setInfoMessage(postedComment.message);
        })
        .catch(error => console.log(error))
    };

    const checkValueOfContent = (value) => {
        if (match.regex.wordsFilter.test(value)) {
            setContentError('error');
            setContent(value);
        } else {
            setContentError('');
            setContent(value);
        }
    }

    const checkValueOfLink = (value) => {
        if (!match.regex.isGif.test(value) && value !== '') {
            setImgLinkError('error');
            setImgLink(value);
        } else {
            setImgLinkError('');
            setImgLink(value);
        }
    }


    return (
        <article className="media is-flex is-flex-direction-column is-justify-content-center is-align-items-center mt-5">
            <div>
                <p className='is-size-6 has-text-centered pb-2'>Ajouter un commentaire :</p>
            </div>
            <div className="media container is-fluid is-flex is-flex-direction-row is-align-items-start">
                <div className="media-content">
                    <div className="field">
                        <p className="control">
                            <textarea
                                className={`textarea ${contentError === 'error' && 'has-text-danger errorInput'}`}
                                name="content"
                                value={content}
                                onChange={(e) => {
                                    checkValueOfContent(e.target.value);
                                }}
                                cols='30' rows='2'
                                placeholder="Ajouter un commentaire...">
                            </textarea>
                        </p>
                        {
                            contentError &&
                            <span className='help has-text-danger mb-5'>Votre message contient des insultes ou mot(s) interdit(s), veuillez le corriger...</span>
                        }
                    </div>
                    <div className="field">
                        <p className="control is-flex is-justify-content-center">
                            <input
                                className={`${imgLinkError === 'error' && 'has-text-danger errorInput'}`}
                                type="text"
                                name="imgLink"
                                value={imgLink && imgLink}
                                onChange={(e) => {
                                    checkValueOfLink(e.target.value);
                                }}
                                placeholder="Ajouter le lien d'un gif"
                            />
                        </p>
                        {
                            imgLinkError &&
                            <span className='help has-text-centered has-text-danger'>Veuillez saisir un lien valide terminant par '.gif' (ex: lien-fichier.gif).</span>
                        }
                    </div>
                    <div className="field">
                        <p className="control is-flex is-justify-content-center">
                            <button onClick={postComment} disabled={ (!content && !imgLink) || (contentError || imgLinkError) } className="button is-uppercase">Ajouter</button>
                        </p>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default PostCommentForm
