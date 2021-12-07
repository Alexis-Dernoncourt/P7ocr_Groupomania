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
        fetch('http://localhost:4000/api/auth/profile', {
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

        fetch(`http://localhost:4000/api/auth/profile-update/${user.id}`, {
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
        <div className="profileInfoContainer alignItemsCenter">
            {user.photo && <img className="profilePicture" src={user.photo} alt="profile" />}

            <form onSubmit={handleSubmit} id="form" ref={formRef} className="width40vw" encType="multipart/form-data">
                <div className="formContainer formContainer-profileUpdate">
                    <h2>Modifier votre profil :</h2>
                    <div className="inputContainer">
                        <div className="labelContainer">
                            <label htmlFor="firstName">Votre prénom :</label>
                        </div>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                placeholder={!firstnameValue ? "Prénom" : firstnameValue}
                                value={firstnameValue && firstnameValue}
                                onChange={(e) => setFirstnameValue(e.target.value)}
                            />
                    </div>

                    <div className="inputContainer">
                        <div className="labelContainer">
                            <label htmlFor="image">Votre nouvelle photo :</label>
                        </div>
                            <input
                                className="paddingTop20px"
                                type="file"
                                name="image"
                                id="image"
                                ref={imageInput}
                                accept=".jpg,.jpeg,.png"
                                onChange={imageChange}
                            />
                            {
                                imageValue && selectedImage &&   
                                                <div className="profileInfoContainer">
                                                    <div className="relative">
                                                        <img className="thumb" src={URL.createObjectURL(selectedImage)} alt="profil" />
                                                        <span>
                                                            <button onClick={removeSelectedImage} className="thumbDelete">
                                                                X
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                                
                            }
                    </div>
                    
                    <div className="inputContainer">
                        <div className="labelContainer">
                            <label htmlFor="lastName">Votre nom :</label>
                        </div>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                placeholder={!lastnameValue ? "Nom" : lastnameValue}
                                value={lastnameValue && lastnameValue}
                                onChange={(e) => setLastnameValue(e.target.value)}
                            />
                    </div>
                    
                    <div className="inputContainer">
                        <div className="labelContainer">
                            <label htmlFor="email">Votre email :</label>
                        </div>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                disabled
                                placeholder={!user ? "Email" : user.email}
                            />
                    </div>
                    <div>
                        <button className="btn" type="submit" disabled={ (firstnameValue === user.firstName && lastnameValue === user.lastName) && !imageValue }>
                            Modifier
                        </button>
                    </div>
                    <div className="loginLink">
                        <Link to="/profile">Annuler</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ProfileUpdate
