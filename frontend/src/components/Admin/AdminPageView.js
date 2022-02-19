import { useEffect } from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminPageView = () => {
    const location = useLocation();
    useEffect(() => {
        document.title = 'Groupomania - ADMIN : section modération';
    }, []);

    return (
        <>
            <div className="hero mt-6">
                <div className="hero-body is-flex is-flex-direction-column is-flex-justify-content-center is-align-items-center">
                <h1 className="title is-size-2 is-size-4-mobile">Espace de modération</h1>
                    <div>
                        <Link to="/admin/moderate-posts" className={`button is-large is-link mx-3 my-2 ${(location.pathname === '/admin/moderate-posts') ? '' : 'is-outlined' }`}>Modérer les articles</Link>
                        <Link to="/admin/moderate-comments" className={`button is-large is-link mx-3 my-2 ${(location.pathname === '/admin/moderate-comments') ? '' : 'is-outlined' }`}>Modérer les commentaires</Link>
                        </div>
                </div>
            </div>
        
            <Outlet />
        </>
    )
}

export default AdminPageView
