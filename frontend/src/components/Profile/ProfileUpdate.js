import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector} from 'react-redux';
import '../SignupForm/SignupForm.css';
import './Profile.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { updateUser } from '../../redux/userSlice';
import toast from 'react-hot-toast';

const ProfileUpdate = () => {
    const navigate = useNavigate();
    const [firstnameValue, setFirstnameValue] = useState("");
    const [lastnameValue, setLastnameValue] = useState("");
    const [imageValue, setImageValue] = useState("");
    const [selectedImage, setSelectedImage] = useState();
    const dispatch = useDispatch();
    const { userInfos, pending, fulfilled, error } = useSelector((state) => state.user);

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
        if (userInfos) {
            setFirstnameValue(userInfos.firstName);
            setLastnameValue(userInfos.lastName);
        }
    }, [userInfos]);    

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = formRef.current;

        if (imageValue && formRef.current[1] && formRef.current[1].files[0].size > 1000*1000*8) {
            toast.error('La taille du fichier pour votre photo de profil doit être inférieure à 8 Mo.', { duration: 6000 });
            navigate("/profile");
        } else {
            const userToUpdate = {
                id: userInfos.id,
                firstName: firstnameValue,
                lastName: lastnameValue,
                photo: selectedImage ? selectedImage.name : ""
            };
    
            dispatch(updateUser({user: userToUpdate, form: form}));
            if (fulfilled) {
                toast.success('Votre profil a bien été modifié');
                navigate("/profile");
            };
        }
    };

    if (pending) return (
        <div className="columns is-centered mx-0 mt-5">
            <LoadingSpinner />
        </div>
    )
    
    return (
        <div className="columns is-centered mx-0 mt-5">
            <div className="my-5 column is-three-fifths-desktop is-three-quarters-tablet has-text-centered px-0">
                <div className="formContainer">
                    <form onSubmit={handleSubmit} ref={formRef} encType="multipart/form-data">
                        <h2 className='title is-size-5-mobile is-uppercase has-text-link mx-auto'>Modifier votre profil</h2>

                        {userInfos.photo && <div className='mx-auto'><img className="profilePicture" src={userInfos.photo} alt="profile" /></div>}

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
                                        placeholder={!userInfos ? "Email" : userInfos.email}
                                    />
                            </div>
                        </div>

                        <div className='mx-auto'>
                            {error && <p>Il y a eu une erreur.</p>}
                            <button className="button is-rounded is-primary is-medium is-uppercase my-5" type="submit" disabled={ (firstnameValue === userInfos.firstName && lastnameValue === userInfos.lastName) && !imageValue }>
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
