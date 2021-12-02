import {Link} from 'react-router-dom';
import Logo from '../../assets/images/logos/icon-left-font.png'
import './Header.css';

function Navbar() {
    return (
        <div className="mainNavigation">
            <div>
                <img src={Logo} alt="Logo Groupomania" className="logo-head" />
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/profile">Mon profil</Link>
                    </li>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
