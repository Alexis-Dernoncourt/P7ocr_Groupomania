import { useState } from 'react';
import match from '../../utils/regex';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useUpdateOneCommentMutation } from '../../redux/apiSlice';

const ModifyCommentForm = ({ commentId, setShowModifyForm, commentToModify, setCommentToModify }) => {
    const [content, setContent] = useState(commentToModify.content ? commentToModify.content : '');
    const [imgLink, setImgLink] = useState(commentToModify.media ? commentToModify.media : '');
    const [contentError, setContentError] = useState('');
    const [imgLinkError, setImgLinkError] = useState('');
    const { userInfos } = useSelector((state) => state.user);
    const [ updateOneComment ] = useUpdateOneCommentMutation();

    const modifyComment = async () => {
        const body = {
            "content": content,
            "imgLink": imgLink,
            "userId": userInfos.id,
        };

        try {
            const payload = await updateOneComment({id: commentId, post: body, postId: commentToModify.postId}).unwrap();
            toast.success(payload.message);
            setContent('');
            setImgLink('');
            setCommentToModify({});
            setShowModifyForm(false);
        } catch (error) {
            toast.error(error.data.message);
        };
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

    const closeModifyForm = () => {
        setShowModifyForm(false);
        setCommentToModify({});
    };

    return (
        <div>
            <div>
                <p className='is-size-6 has-text-centered pb-2'>Modifier votre commentaire :</p>
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
                                value={imgLink}
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
                            <button onClick={modifyComment} disabled={ (!content && !imgLink) || (contentError || imgLinkError) } className="button is-uppercase">Modifier</button>
                        </p>
                    </div>
                </div>
            </div>
            
            <button onClick={closeModifyForm} className='button is-info is-outlined has-text-info-dark mx-4'>Annuler</button>
        </div>
    )
}

export default ModifyCommentForm
