import {Link} from 'react-router-dom';

const Form = ({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, isSubmitting }) => {



    return (
        <div className="formContainer">
            <form onSubmit={handleSubmit} method="POST">
                    <h2 className='title is-2 mx-auto my-6'>Inscription</h2>

                    <div className="field">
                        <div className="my-4 mx-auto control">
                                <input
                                    type="text"
                                    name="firstname"
                                    placeholder="Prénom"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.firstname}
                                />
                            <span className={errors.firstname ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.firstname && touched.firstname && errors.firstname}</span>
                        </div>
                    </div>
                    
                    <div className="field">
                        <div className="my-4 mx-auto control">
                                <input
                                    type="text"
                                    name="lastname"
                                    placeholder="Nom"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.lastname}
                                />
                            <span className={errors.lastname ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.lastname && touched.lastname && errors.lastname}</span>
                        </div>
                    </div>
                    
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
                    
                    <div className="field">
                        <div className="my-4 mx-auto control">
                                <input
                                    type="password"
                                    name="passwordConfirmation"
                                    placeholder="Confirmation du mot de passe"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.passwordConfirmation}
                                />
                                <span className={errors.passwordConfirmation ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.passwordConfirmation && touched.passwordConfirmation && errors.passwordConfirmation}</span>
                        </div>
                    </div>

                    <div className='mx-auto'>
                        <span className={errors.info ? 'block help is-size-6-desktop errorMsg' : ''}>{errors.info && errors.info}</span>
                        <button className="button is-primary is-rounded is-medium my-4" type="submit" disabled={!isValid || isSubmitting}>
                            M'inscrire
                        </button>
                    </div>
                    <div className="mx-auto mt-5">
                        <Link to="/login" className='has-text-link has-text-weight-semibold'>J'ai déjà un compte, je veux me connecter</Link>
                    </div>
            </form>
        </div>
    )
}

export default Form
