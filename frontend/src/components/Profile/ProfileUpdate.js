import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import '../SignupForm/SignupForm.css';
import './Profile.css';

const ProfileUpdate = ({ setInfoMessage }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [firstnameValue, setFirstnameValue] = useState("");
    const [lastnameValue, setLastnameValue] = useState("");
    const [imageValue, setImageValue] = useState("");
    const [selectedImage, setSelectedImage] = useState();

    const imageInput = useRef("");

    const formRef = useRef({});

    const imageChange = () => {
        setImageValue(formRef.current[1].value);
        
        if (formRef.current[1].files && formRef.current[1].files.length > 0) {
          setSelectedImage(formRef.current[1].files[0]);
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage();
        setImageValue();
        imageInput.current.value = "";
    };

    useEffect(() => {
        document.title = 'Groupomania - Modification de profil';
    }, []);
    
    useEffect(() => {
        fetch('/api/auth/profile', {
            headers: {
                'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => { 
            setUser(data.user);
            setFirstnameValue(data.user.firstName);
            setLastnameValue(data.user.lastName);
        })
        .catch(console.log('erreur'))
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = formRef.current;

        fetch(`/api/auth/profile-update/${user.id}`, {
            headers: {
                'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            },
            method: "PUT",
            body: new FormData(form)
        })
        .then(data => data.json())
        .then((response) => {
            setInfoMessage(response.message);
            navigate("/profile");
        })
        .catch(error => {
            console.log(error);
        })
    }

    
    return (
        <div className="columns is-centered mx-0 mt-5">
            <div className="my-5 column is-three-fifths-desktop is-three-quarters-tablet has-text-centered px-0">
                <div className="formContainer">
                    <form onSubmit={handleSubmit} ref={formRef} encType="multipart/form-data">
                        <h2 className='title is-size-5-mobile is-uppercase has-text-link mx-auto'>Modifier votre profil</h2>

                        {user.photo && <div className='mx-auto'><img className="profilePicture" src={user.photo} alt="profile" /></div>}

                        <div className="field">
                            <div className="my-4 mx-auto control">
                                <div className="label">
                                    <label htmlFor="firstName">Votre prénom :</label>
                                </div>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder={!firstnameValue ? "Prénom" : firstnameValue}
                                        value={firstnameValue && firstnameValue}
                                        onChange={(e) => setFirstnameValue(e.target.value)}
                                    />
                            </div>
                        </div>

                        <div className="field">
                            <div className="my-4 mx-auto control">
                                <div className="label">
                                    <label htmlFor="image">Votre nouvelle photo :</label>
                                </div>
                                    <input
                                        className="pt-4"
                                        type="file"
                                        name="image"
                                        ref={imageInput}
                                        accept=".jpg,.jpeg,.png"
                                        onChange={imageChange}
                                    />
                                    {
                                        imageValue && selectedImage &&   
                                                        <div className="is-flex is-flex-direction-row is-justify-content-center">
                                                            <div className="relative mt-4">
                                                                <img className="thumb" src={URL.createObjectURL(selectedImage)} alt="profil" />
                                                                <span>
                                                                    <button onClick={removeSelectedImage} className="thumbDelete button is-rounded is-danger">
                                                                        X
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                    }
                            </div>
                        </div>
                        
                        <div className="field">
                            <div className="my-4 mx-auto control">
                                <div className="label">
                                    <label htmlFor="lastName">Votre nom :</label>
                                </div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder={!lastnameValue ? "Nom" : lastnameValue}
                                        value={lastnameValue && lastnameValue}
                                        onChange={(e) => setLastnameValue(e.target.value)}
                                    />
                            </div>
                        </div>
                        
                        <div className="field">
                            <div className="my-4 mx-auto control">
                                <div className="label">
                                    <label htmlFor="email">Votre email :</label>
                                </div>
                                    <input
                                        type="text"
                                        name="email"
                                        disabled
                                        placeholder={!user ? "Email" : user.email}
                                    />
                            </div>
                        </div>

                        <div className='mx-auto'>
                            <button className="button is-rounded is-primary is-medium is-uppercase my-5" type="submit" disabled={ (firstnameValue === user.firstName && lastnameValue === user.lastName) && !imageValue }>
                                Modifier
                            </button>
                        </div>
                        <div className="mx-auto">
                            <Link to="/profile" className='button is-rounded is-outlined is-link is-medium is-uppercase'>Annuler</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileUpdate
