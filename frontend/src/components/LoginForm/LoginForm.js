import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom';
import { Formik } from 'formik';
import '../SignupForm/SignupForm.css';

function LoginForm() {
    const navigate = useNavigate();

    return (
        <div>
            <Formik
                initialValues={{ email: '', password: '' }}
                validate={values => {
                    const errors = {};
                    if (!values.email) {
                        errors.email = 'Veuillez renseigner votre email';
                    } else if (!values.password) {
                        errors.password = 'Veuillez renseigner votre mot de passe';
                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                        errors.email = 'Adresse email invalide';
                    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()+,-./:;=?@[\]^_`{|}~])[A-Za-z0-9!#$%&()+,-./:;=?@[\]^_`{|}~]{8,}$/.test(values.password)) {
                        errors.password = 'Invalide. *Au moins 8 caractères comprenants 1 chiffre, une majuscule et 1 caractère spécial.';
                    }
                    return errors;
                }}

                onSubmit={(values, { setSubmitting, resetForm }) => {
                    fetch("http://localhost:4000/api/auth/login", {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body: JSON.stringify(values)
                    })
                    .then(data => data.json())
                    .then(response => {
                        localStorage.setItem('token', `Bearer ${response.token}`);
                        setSubmitting(false);
                        resetForm();
                        navigate("/profile");
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
                      <h2>Connexion</h2>
                        
                        <div className="inputContainer">
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
                        

                        <div>
                            <button className="btn" type="submit" disabled={!isValid || isSubmitting}>
                                Me connecter
                            </button>
                        </div>
                        <div className="loginLink">
                            <Link to="/signup">+ Je veux créer un compte pour me connecter</Link>
                        </div>
                      </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default LoginForm
