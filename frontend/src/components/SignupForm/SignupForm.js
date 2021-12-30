import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from 'formik';
import Form from "./Form";
import './SignupForm.css';
import { AuthContext } from "../../context/AuthContext";
import match from '../../utils/regex';

const SignupForm = ({ setInfoMessage }) => {

    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth) {
            navigate('/articles');
        }
    }, [auth, navigate]);

    const fetchOnSubmit = (values, { setSubmitting, resetForm }) => {
        fetch("/api/auth/signup", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(values)
        })
        .then(data => data.json())
        .then((response) => {
            setInfoMessage(response.message);
            setSubmitting(false);
            resetForm();
            navigate("/login");
        })
        .catch(() => {
            setInfoMessage('Une erreur est survenue. Veuillez vérifier vos information puis réessayer.');
        })
    };

    const checkErrors = (values, errors) => {
        if (!values.firstname) {
            errors.firstname = 'Veuillez renseigner votre prénom';
        } 
        if (match.regex.wordsFilter.test(values.firstname) || match.regex.wordsFilter.test(values.lastname) || match.regex.wordsFilter.test(values.email) || match.regex.wordsFilter.test(values.password)) {
            errors.info = 'Un des champ comporte une insulte ou un mot interdit. Veuillez corriger pour continuer.';
        } 
        if (!values.lastname) {
            errors.lastname = 'Veuillez renseigner votre nom';
        } 
        if (!values.email) {
            errors.email = 'Veuillez renseigner votre email';
        } 
        if (!values.password) {
            errors.password = 'Veuillez renseigner votre mot de passe';
        } 
        if (!values.passwordConfirmation) {
            errors.passwordConfirmation = 'Veuillez confirmer votre mot de passe';
        } 
        if (!match.regex.mailCheck.test(values.email)) {
            errors.email = 'Adresse email invalide';
        } else if (!match.regex.passwordCheck.test(values.password)) {
            errors.password = 'Invalide. *Au moins 8 caractères comprenants 1 chiffre, une majuscule et 1 caractère spécial.';
        } 
        if (values.password !== values.passwordConfirmation) {
            errors.password = 'Les mots de passe ne sont pas identiques. Veuillez réessayer.';
            errors.passwordConfirmation = 'Les mots de passe ne sont pas identiques. Veuillez réessayer.';
        }
    };

    return (
        <div className='columns is-centered mx-0'>
            <Formik
                initialValues={{ firstname: '', lastname: '', email: '', password: '', passwordConfirmation: '', info:'' }}
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
                    isValid,
                    isSubmitting
                    /* and other goodies */

                }) => (
                    <div className="column is-three-fifths-desktop is-three-quarters-tablet has-text-centered px-0">
                        <Form   values={values}
                                errors={errors}
                                touched={touched}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                handleSubmit={handleSubmit}
                                isValid={isValid}
                                isSubmitting={isSubmitting}
                        />
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default SignupForm
