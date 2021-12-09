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
            navigate('/home');
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
        } else if (!values.lastname) {
            errors.lastname = 'Veuillez renseigner votre nom';
        } else if (!values.email) {
            errors.email = 'Veuillez renseigner votre email';
        } else if (!values.password) {
            errors.password = 'Veuillez renseigner votre mot de passe';
        } else if (!values.passwordConfirmation) {
            errors.passwordConfirmation = 'Veuillez confirmer votre mot de passe';
        } else if (!match.regex.mailCheck.test(values.email)) {
            errors.email = 'Adresse email invalide';
        } else if (!match.regex.passwordCheck.test(values.password)) {
            errors.password = 'Invalide. *Au moins 8 caractères comprenants 1 chiffre, une majuscule et 1 caractère spécial.';
        } else if (values.password !== values.passwordConfirmation) {
            errors.password = 'Les mots de passe ne sont pas identiques. Veuillez réessayer.';
            errors.passwordConfirmation = 'Les mots de passe ne sont pas identiques. Veuillez réessayer.';
        }
    };

    return (
        <div>
            <Formik
                initialValues={{ firstname: '', lastname: '', email: '', password: '', passwordConfirmation: '' }}
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
                    
                    <Form   values={values}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            handleSubmit={handleSubmit}
                            isValid={isValid}
                            isSubmitting={isSubmitting}
                    />

                )}
            </Formik>
        </div>
    )
}

export default SignupForm
