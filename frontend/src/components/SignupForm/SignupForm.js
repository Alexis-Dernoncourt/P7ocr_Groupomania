import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from 'formik';
import Form from "./Form";
import './SignupForm.css';
import { AuthContext } from "../../context/AuthContext";

const SignupForm = ({ setInfoMessage }) => {

    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(auth) {
            navigate('/home');
        }
    }, [auth, navigate]);

    return (
        <div>
            <Formik
                initialValues={{ firstname: '', lastname: '', email: '', password: '', passwordConfirmation: '' }}
                validate={values => {
                    const errors = {};
                    if (!values.firstname) {
                        errors.firstname = 'Veuillez renseigner votre prénom';
                    } else if (!values.lastname) {
                        errors.lastname = 'Veuillez renseigner votre nom';
                    } else if (!values.email) {
                        errors.email = 'Veuillez renseigner votre email';
                    } else if (!values.password) {
                        errors.password = 'Veuillez renseigner votre mot de passe';
                    } else if(!values.passwordConfirmation) {
                        errors.passwordConfirmation = 'Veuillez confirmer votre mot de passe';
                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                        errors.email = 'Adresse email invalide';
                    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()+,-./:;=?@[\]^_`{|}~])[A-Za-z0-9!#$%&()+,-./:;=?@[\]^_`{|}~]{8,}$/.test(values.password)) {
                        errors.password = 'Invalide. *Au moins 8 caractères comprenants 1 chiffre, une majuscule et 1 caractère spécial.';
                    } else if (values.password !== values.passwordConfirmation) {
                        errors.password = 'Les mots de passe ne sont pas identiques. Veuillez réessayer.';
                        errors.passwordConfirmation = 'Les mots de passe ne sont pas identiques. Veuillez réessayer.';
                    }
                    return errors;
                }}

                onSubmit={(values, { setSubmitting, resetForm }) => {
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
                    .catch(error => {
                        console.log(error);
                    })
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
