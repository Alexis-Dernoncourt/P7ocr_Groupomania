import {Link} from 'react-router-dom';

const Form = ({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, isSubmitting }) => {



    return (
        <div>
            <form onSubmit={handleSubmit} method="POST">
                      <div className="formContainer">
                      <h2>Inscription</h2>
                        <div className="inputContainer">
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
                        
                        <div className="inputContainer">
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
        </div>
    )
}

export default Form
