import { useState, useEffect } from 'react';
import LogoutBtn from '../Profile/LogoutBtn';
import '../Profile/Profile.css';

const Home = ({ setInfoMessage }) => {
    const [data, setData] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        document.title = 'Groupomania - Accueil';
    }, []);

    useEffect(() => {
        fetch("http://localhost:4000/api/auth/login", {
            headers: {
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then(data => { setData(data.users) })
        .catch(console.log('erreur'))
    }, [token]);

    return (
        <div className="mtmb-2rem">
            <h2>HOME</h2>
            { data && <div className="alignLeft"><LogoutBtn setInfoMessage={setInfoMessage} /></div> }
            {
                !data ? "Loading..." :
                data.map(el => {
                    return  <div className="profileInfoContainer" key={`${el.firstName}-${el.id}`}>
                                <div className="profileInfoContainer alignItemsCenter mt-2rem cardHome">
                                    <img className="thumb" src={el.photo} alt="thumbnail-profile" />
                                    <div>
                                        <p>{el.firstName} {el.lastName} ({el.email})</p>
                                        <small>mis à jour <em>{new Date(el.updatedAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</em> à <em>{new Date(el.updatedAt).toLocaleTimeString('fr-FR')}</em></small>
                                    </div>
                                </div>
                            </div>
                })
            }
        </div>
    )
}

export default Home
