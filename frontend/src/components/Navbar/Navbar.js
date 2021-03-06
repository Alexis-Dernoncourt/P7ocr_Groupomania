import { useState } from 'react';
import {Link, useLocation} from 'react-router-dom';
import Logo from '../../assets/images/logos/icon-left-font.png'
import './Navbar.css';
import LogoutBtn from '../Profile/LogoutBtn';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const [isActive, setisActive] = useState(false);
    const { userInfos, authenticated } = useSelector((state) => state.user);
    const location = useLocation();

    return (
        <nav className='navbar is-fixed-top' role='navigation' aria-label='main navigation'>
            <div className='navbar-brand'>
                <Link to='/articles'>
                    <img src={Logo} alt='Logo Groupomania' className='logoHead' />
                </Link>

                <button onClick={() => setisActive(!isActive)} className={`navbar-burger  ${isActive ? 'is-active burgerBtn' : ''}`} aria-label='menu' aria-expanded='false' data-target='mainMenu'>
                    <span aria-hidden='true'></span>
                    <span aria-hidden='true'></span>
                    <span aria-hidden='true'></span>
                </button>
            </div>

            <div id='mainMenu' className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                <div className='navbar-end'>
                    <div className='navbar-item'>
                        <div className={`buttons ${isActive ? 'is-flex is-flex-direction-column' : ''}`}>
                            { authenticated && authenticated ?
                                <>
                                    <Link to='/articles' className={`button is-info is-outlined is-uppercase mx-5 mw130 mt-3 ${(location.pathname === '/articles') ? 'active' : '' } `}>Articles</Link>
                                    <Link to='/profile' className={`button is-info is-outlined is-uppercase mx-5 mw130 mt-3 ${(location.pathname === '/profile') ? 'active' : '' }`}>Mon profil</Link>
                                    { userInfos.role === 'moderator' &&
                                        <Link to='/admin' className={`button is-primary is-uppercase mx-5 mw130 mt-3 ${(location.pathname === '/admin') ? '' : 'is-outlined' }`}>Admin Zone</Link>
                                    }
                                    <LogoutBtn />
                                </>
                            :   
                                <>
                                    <Link to='/signup' className={`button is-info is-outlined is-uppercase mx-5 mw130 mt-3 ${(location.pathname === '/signup') ? 'active' : '' }`}>S'inscrire</Link>
                                    <Link to='/login' className={`button is-info is-outlined is-uppercase mx-5 mw130 mt-3 ${(location.pathname === '/login') ? 'active' : '' }`}>Se connecter</Link>
                                </>
                            }
                        </div>
                    </div>
                </div>    
            </div>
        </nav>
    )
}

export default Navbar
