import { useContext } from 'react';
import {Link} from 'react-router-dom';
import Logo from '../../assets/images/logos/icon-left-font.png'
import './Header.css';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {

    const {auth} = useContext(AuthContext);

    return (
        <div className="mainNavigation">
                <div>
                    <img src={Logo} alt="Logo Groupomania" className="logo-head" />
                </div>
                { auth ?
                    <nav>
                        <ul>
                            <li>
                                <Link to="/home">Home</Link>
                            </li>
                            <li>
                                <Link to="/profile">Mon profil</Link>
                            </li>
                        </ul>
                    </nav>
                :   <nav>
                        <ul>
                            <li>
                                <Link to="/signup">Signup</Link>
                            </li>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        </ul>
                    </nav> 
                }
            </div>
    )
}

export default Navbar
