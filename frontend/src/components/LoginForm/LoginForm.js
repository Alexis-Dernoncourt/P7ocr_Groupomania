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
            navigate('/profile');
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
                localStorage.setItem('user_id', response.userId);
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
        } else if (match.regex.wordsFilter.test(values.email) || match.regex.wordsFilter.test(values.password)) {
            errors.info = 'Un des champ comporte une insulte ou un mot interdit. Veuillez corriger pour continuer.';
        }
    };


    return (
        <div className='columns is-centered mx-0'>
        {infoMessage && <div className="infoMessage"><p>{infoMessage}</p></div>}
        <Formik
            initialValues={{ email: '', password: '', info: '' }}
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
                <div className="formContainer column is-three-fifths-desktop is-three-quarters-tablet has-text-centered px-0">
                    <form className='field' onSubmit={handleSubmit} method="POST">
                        <h2 className="title is-2 mx-auto my-6">Connexion</h2>
                        
                        <div className="field">
                            <div className="my-4 mx-auto control">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                    />
                                <span className={errors.email ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.email && touched.email && errors.email}</span>
                            </div>
                        </div>

                        <div className="field">
                            <div className="my-4 mx-auto control">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Mot de passe"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        className={errors.password && 'errorInput'}
                                    />
                                <span className={errors.password ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.password && touched.password && errors.password}</span>
                            </div>
                        </div>
                        

                        <div className="mx-auto">
                            <span className={errors.info ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.info && errors.info}</span>
                            <button className="button is-primary is-rounded is-medium my-4" type="submit" disabled={!isValid || isSubmitting}>
                                Me connecter
                            </button>
                        </div>
                        <div className="mx-auto mt-5">
                            <Link to="/signup" className="has-text-link has-text-weight-semibold">+ Je veux créer un compte</Link>
                        </div>
                    </form>
                </div>
            )}
        </Formik>
        </div>
    )
}

export default LoginForm
