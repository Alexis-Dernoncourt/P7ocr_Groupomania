import { useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik } from 'formik';
import '../SignupForm/SignupForm.css';
import { AuthContext } from "../../context/AuthContext";
import match from '../../utils/regex';

const LoginForm = ({ infoMessage, setInfoMessage }) => {

    const {auth, setAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    if (infoMessage) {
        setTimeout(() => {
            setInfoMessage(null);
        }, 5000);
    };

    useEffect(() => {
        if (auth) {
            navigate('/home');
        }
    }, [auth, navigate]);

    const fetchOnSubmit = (values, { setSubmitting, resetForm }) => {
        fetch("/api/auth/login", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(values)
        })
        .then(data => data.json())
        .then(response => {
            if (response.status && response.status === 'error') {
                setInfoMessage(response.message);
                setSubmitting(false);
            } else {
                setInfoMessage(response.message);
                localStorage.setItem('token', `Bearer ${response.token}`);
                setSubmitting(false);
                resetForm();
                if (!auth) {
                    setAuth(true);
                    navigate("/profile");
                }
            }
        })
        .catch(() => {
            setInfoMessage('Une erreur est survenue. Veuillez vérifier vos information puis réessayer.');
        })
    };

    const checkErrors = (values, errors) => {
        if (!values.email) {
            errors.email = 'Veuillez renseigner votre email';
        } else if (!values.password) {
            errors.password = 'Veuillez renseigner votre mot de passe';
        } else if (!match.regex.mailCheck.test(values.email)) {
            errors.email = 'Adresse email invalide';
        } else if (!match.regex.passwordCheck.test(values.password)) {
            errors.password = 'Invalide. *Au moins 8 caractères comprenants 1 chiffre, une majuscule et 1 caractère spécial.';
        }
    };


    return (
        <div>
            {infoMessage && <div className="infoMessage"><p>{infoMessage}</p></div>}
            <Formik
                initialValues={{ email: '', password: '' }}
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
                            <Link to="/signup">+ Je veux créer un compte</Link>
                        </div>
                      </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default LoginForm
