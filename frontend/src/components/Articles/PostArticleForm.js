import { useState, useRef } from 'react';
import { Formik } from 'formik';
import match from '../../utils/regex';
import './PostArticleForm.css';
import { useSelector } from 'react-redux';
import { useAddOnePostMutation } from '../../redux/apiSlice';
import toast from 'react-hot-toast';

const PostArticleForm = ({ showModal, setShowModal }) => {
    const [preview, setPreview] = useState('');
    const { userInfos } = useSelector((state) => state.user);
    const [ addOnePost ] = useAddOnePostMutation();
    const formRef = useRef({});
    const imageInput = useRef(null);

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

    const fetchOnSubmit = async (values, { setSubmitting, resetForm }) => {
        const form = formRef.current;
        try {
            const payload = await addOnePost(form).unwrap();
            console.log(payload);
            setSubmitting(false);
            resetForm();
            toast.success(payload.message);
            hide();
        } catch (error) {
            console.log(error);
            toast.error(error.data.message);
            setSubmitting(false);
        };
    };

    const hide = () => {
        setShowModal(false);
    };

    const checkErrors = (values, errors) => {
        if (match.regex.wordsFilter.test(values.content)) {
            errors.content = 'Pas d\'insultes ou mot interdit, veuillez de corriger votre message...';
        } 
        if (match.regex.wordsFilter.test(values.imgLink)) {
            errors.imgLink = 'Pas d\'insultes ou mot interdit, veuillez de corriger votre message...';
        } 
        if (!values.imgLink && !values.content && !values.file) {
            errors.info = 'Veuillez renseigner au moins un des champs ci-dessus.';
        }
    };


    return (
        <div>
            <Formik
            initialValues={{ user_id: userInfos.id, imgLink: '', content: '', file: '', info:'' }}

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
            <div className={`modal ${showModal && 'is-flex'} `}>
                <div className="modal-background"></div>
                    <div className='modal-content modal-content-perso'>
                        <div className="columns is-full-mobile mx-0 mt-5">
                            <div className="column is-full-mobile is-vcentered has-text-centered px-0">
                                <div className="formContainer">
                                    <form onSubmit={handleSubmit} ref={formRef} encType="multipart/form-data">
                                        <h2 className='title is-size-5-mobile is-uppercase has-text-link mx-auto'>Ajouter un article</h2>

                                        <div className="field">
                                            <div className="my-4 mx-auto control wrap-text">
                                                <div className="label has-text-info">
                                                    <label htmlFor="image">Ajouter une image* :</label>
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
                                                    <div className={errors.content ? 'block help has-text-info is-size-6-desktop' : ''}>
                                                        <p className='has-text-info'>
                                                            *La taille de l'image doit être inférieure à 8 Mo et être au format jpeg/jpg/png ou gif.
                                                        </p>
                                                    </div>
                                                    {
                                                        values.file &&   
                                                        <div className="is-flex is-flex-direction-row is-justify-content-center">
                                                            <div className="mt-4 is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
                                                                <img src={preview} alt="profil" className='is-relative container img-publication'/>
                                                                <span className=''>
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
                                                <div className="label has-text-info">
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
                                                <div className="label has-text-info">
                                                    <label htmlFor="content">Votre message* :</label>
                                                </div>
                                                    <textarea
                                                        name="content"
                                                        className={`${errors.content && 'errorInput'} textarea-message p-5 is-size-5 has-text-centered`}
                                                        rows="10"
                                                        placeholder="Votre message"
                                                        value={values.content}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    ></textarea>

                                                    <div className={errors.content ? 'block help has-text-info is-size-6-desktop' : ''}>
                                                        <p className='has-text-info'>
                                                            *Uniquement des caractères et des chiffres, avec espace(s) et/ou tiret(s).
                                                        </p>
                                                        <p className='has-text-info'>
                                                            (sauf ', ", &, ?, ), et !, les caractères spéciaux ne sont pas autoriés).
                                                        </p>
                                                    </div>
                                                    <span className={errors.content ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.content && touched.content && errors.content}</span>
                                            </div>
                                        </div>
                                        
                                        <span className={errors.info ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.info && errors.info}</span>
                                        
                                        <div className='is-flex is-justify-content-center is-align-items-center mt-5'>
                                            <button className="button is-rounded is-primary is-medium is-uppercase my-5 mx-3" type='submit' disabled={(values.file === null && values.content === '' && !values.imgLink) || isSubmitting || !isValid }>Publier</button>
                                        
                                            <button onClick={hide} className='button is-rounded is-outlined is-link is-medium is-uppercase my-5 mx-3'>Annuler</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={hide} className="modal-close is-large" aria-label="close"></button>
                </div>
            )}
            </Formik>
        </div>
    )
}

export default PostArticleForm
