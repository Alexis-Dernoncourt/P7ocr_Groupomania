import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import match from '../../utils/regex';
//import '../SignupForm/SignupForm.css';
import './PostArticleForm.css';

const UpdateArticleView = ({ setInfoMessage }) => {

    const [preview, setPreview] = useState('');
    const [article, setArticle] = useState({});
    const userId = localStorage.getItem('user_id');
    const params = useParams();
    const postId = params.id;
    const navigate = useNavigate();

    const formRef = useRef({});
    const imageInput = useRef(null);

    useEffect(() => {
        document.title = 'Groupomania - Modification de l\'article';
    }, []);
    
    useEffect(() => {
        fetch(`/api/posts/${postId}`, {
            headers: {
                'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(article => { 
            setArticle(article.post);
        })
        .catch(console.log('erreur'))
    }, [postId]);

    const showImage = ( file ) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPreview(reader.result);
        }
    };

    const removeSelectedImage = () => {
        setPreview();
        imageInput.current.value = "";
    };

    const fetchOnSubmit = (values, { setSubmitting, resetForm }) => {
        const form = formRef.current;
        fetch(`/api/posts/${params.id}`, {
            headers: {
                'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            },
            method: "PUT",
            body: new FormData(form)
        })
        .then(data => data.json())
        .then((response) => {
            setSubmitting(false);
            resetForm();
            setInfoMessage(response.message);
            hide();
        })
        .catch(error => {
            console.log(error)
        })
    };

    const hide = () => {
        navigate('/profile');
    };

    const checkErrors = (values, errors) => {
        if (match.regex.wordsFilter.test(values.content)) {
            errors.content = 'Pas d\'insultes ou mot interdit, veuillez de corriger votre message...';
        }
        if (match.regex.wordsFilter.test(values.imgLink)) {
            errors.imgLink = 'Pas d\'insultes ou mot interdit, veuillez de corriger votre message...';
        }
        if (!values.imgLink && !values.file && values.content === article.content) {
            errors.info = 'Veuillez renseigner/modifier au moins un des champs ci-dessus.';
        }
    };

    return (
        <div>
            <Formik
            initialValues={{ user_id: userId, imgLink: '', content: '', file: '', info:'' }}

            validate={values => {
                const errors = {};
                checkErrors(values, errors);
                return errors;
            }}

            onSubmit={(values, { setSubmitting, resetForm }) => {
                fetchOnSubmit(values, { setSubmitting, resetForm });
            }}
            >
            
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isValid,
                isSubmitting

            }) => (
            <div className={`container is-fluid`}>
                {
                !article ?
                <div className='my-6'>
                    <button className="button is-info is-loading is-large is-outlined noborders is-block mx-auto mb-4">Loading</button>
                </div>

                :
                    <div className='modal-content-perso'>
                        <div className="columns is-full-mobile mx-0 mt-5">
                            <div className="column is-full-mobile is-vcentered has-text-centered px-0">
                                <div className="formContainer">
                                    <form onSubmit={handleSubmit} ref={formRef} method="POST">
                                        <h2 className='title is-size-5-mobile is-uppercase has-text-link mx-auto'>Modifier votre publication</h2>

                                    { article.media &&
                                        <div>
                                            <h3 className='title is-size-4 is-size-6-mobile'>L'image de votre publication :</h3>
                                            <div className='media if-flex is-justify-content-center'>
                                                <figure className="image">
                                                    <img src={article.media} alt="Illustration de la publication - Groupomania" className='article-image-to-modify'/>
                                                </figure>
                                            </div>
                                        </div>
                                    }
                                        <div className="field">
                                            <div className="my-4 mx-auto control wrap-text">
                                                <div className="label has-text-link">
                                                    <label htmlFor="image">Ajouter une nouvelle image :</label>
                                                </div>
                                                    <input
                                                        className="pt-4 mx-5"
                                                        type="file"
                                                        name="image"
                                                        ref={imageInput}
                                                        accept=".jpg,.jpeg,.png,.gif"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            setFieldValue("file", e.currentTarget.files[0]);
                                                            showImage(e.currentTarget.files[0]);
                                                          }}
                                                        disabled={values.imgLink}
                                                    />
                                                    {
                                                        values.file &&   
                                                        <div className="is-flex is-flex-direction-row is-justify-content-center">
                                                            <div className="mt-4 is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
                                                                <img src={preview} alt="Publication Groupomania" className='is-relative container img-publication'/>
                                                                <span>
                                                                    <button
                                                                        onClick={() => {
                                                                            removeSelectedImage();
                                                                            setFieldValue("file", null);
                                                                        }}
                                                                        type="button"
                                                                        className="button is-danger is-size-5-mobile is-large py-4 px-5 is-uppercase">
                                                                    Supprimer l'image
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                                        
                                                    }
                                            </div>
                                        </div>

                                        <input type="hidden" name='user_id' value={values.user_id}/>

                                        <div className="field">
                                            <div className="my-4 mx-auto control">
                                                <div className="label has-text-link">
                                                    <label htmlFor="imgLink">Ou ajoutez le lien de l'image :</label>
                                                </div>
                                                    <input
                                                        type="text"
                                                        name="imgLink"
                                                        placeholder="Lien de l'image"
                                                        className={`${errors.imgLink && 'errorInput'}`}
                                                        value={values.imgLink}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        disabled={values.file}
                                                    />
                                                <span className={errors.imgLink ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.imgLink && touched.imgLink && errors.imgLink}</span>
                                            </div>
                                        </div>

                                        <div className="field mt-6">
                                            <div className="my-4 mx-auto control">
                                                <div className="label has-text-link">
                                                    <label htmlFor="content">Votre message :</label>
                                                </div>
                                                    <textarea
                                                        name="content"
                                                        className={`${errors.content && 'errorInput'} textarea-message p-5 is-size-5 has-text-centered`}
                                                        rows="10"
                                                        placeholder="Votre publication initiale n'a pas de contenu texte. Ajoutez votre message !"
                                                        value={values.content ? values.content : article.content}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    ></textarea>
                                                    <span className={errors.content ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.content && touched.content && errors.content}</span>
                                            </div>
                                        </div>
                                        
                                        <span className={errors.info ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.info && errors.info}</span>

                                        <div className='is-flex is-justify-content-center is-align-items-center is-flex-wrap-wrap mt-5'>
                                                <button className="button is-rounded is-primary is-medium is-uppercase my-5 mx-3" type='submit' disabled={((values.content === article.content || values.content === '') && values.file === '' && !values.imgLink) || isSubmitting || !isValid}>Publier</button>
                                            
                                                <button onClick={hide} className='button is-rounded is-outlined is-link is-medium is-uppercase my-5 mx-3'>Annuler</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                </div>
            )}
            </Formik>
        </div>
    )
}

export default UpdateArticleView
