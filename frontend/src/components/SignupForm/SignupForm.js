import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom';
import { Formik } from 'formik';
import './SignupForm.css';

function SignupForm() {
    const navigate = useNavigate();

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
                    fetch("http://localhost:4000/api/auth/signup", {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body: JSON.stringify(values)
                    })
                    .then(() => {
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
                    <form onSubmit={handleSubmit} method="POST">
                      <div className="formContainer">
                      <h2>Inscription</h2>
                        <div className="inputContainer">
                            {/* <div className="labelContainer">
                                <label htmlFor="firstname">Prénom</label>
                            </div> */}
                                <input
                                    type="text"
                                    name="firstname"
                                    id="firstname"
                                    placeholder="Prénom"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.firstname}
                                />
                            <span className={errors.firstname ? 'errorMsg' : ''}>{errors.firstname && touched.firstname && errors.firstname}</span>
                        </div>
                        
                        <div className="inputContainer">
                            {/* <div className="labelContainer">
                                <label htmlFor="lastname">Nom</label>
                            </div> */}
                                <input
                                    type="text"
                                    name="lastname"
                                    id="lastname"
                                    placeholder="Nom"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.lastname}
                                />
                            <span className={errors.lastname ? 'errorMsg' : ''}>{errors.lastname && touched.lastname && errors.lastname}</span>
                        </div>
                        
                        <div className="inputContainer">
                            {/* <div className="labelContainer">
                                <label htmlFor="email">Email</label>
                            </div> */}
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                />
                            <span className={errors.email ? 'errorMsg' : ''}>{errors.email && touched.email && errors.email}</span>
                        </div>

                        <div className="inputContainer">
                            {/* <div className="labelContainer">
                                <label htmlFor="pwd">Mot de passe</label>
                            </div> */}
                                <input
                                    type="password"
                                    name="password"
                                    id="pwd"
                                    placeholder="Mot de passe"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    className={errors.password && 'errorInput'}
                                />
                            <span className={errors.password ? 'errorMsg' : ''}>{errors.password && touched.password && errors.password}</span>
                        </div>
                        
                        <div className="inputContainer">
                            {/* <div className="labelContainer">
                                <label htmlFor="pwdConfirm">Confirmation du mot de passe</label>
                            </div> */}
                                <input
                                    type="password"
                                    name="passwordConfirmation"
                                    id="pwdConfirm"
                                    placeholder="Confirmation du mot de passe"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.passwordConfirmation}
                                />
                                <span className={errors.passwordConfirmation ? 'errorMsg' : ''}>{errors.passwordConfirmation && touched.passwordConfirmation && errors.passwordConfirmation}</span>
                        </div>

                        <div>
                            <button className="btn" type="submit" disabled={!isValid || isSubmitting}>
                                M'inscrire
                            </button>
                        </div>
                        <div className="loginLink">
                            <Link to="/login">J'ai déjà un compte, je veux me connecter</Link>
                        </div>
                      </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default SignupForm
