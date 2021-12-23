import { useEffect } from 'react';
import { Link, Outlet } from "react-router-dom";

const AdminPageView = () => {
    useEffect(() => {
        document.title = 'Groupomania - ADMIN : section modération';
    }, []);

    return (
        <>
            <div className="hero mt-6">
                <div className="hero-body is-flex is-flex-direction-column is-flex-justify-content-center is-align-items-center">
                <h1 className="title is-size-2 is-size-4-mobile">Espace de modération</h1>
                    <div>
                        <Link to="/admin/moderate-posts" className="button is-large is-link is-outlined mx-3 my-2">Modérer les articles</Link>
                        <Link to="/admin/moderate-comments" className="button is-large is-link is-outlined mx-3 my-2">Modérer les commentaires</Link>
                        </div>
                </div>
            </div>
         
            <Outlet />
        </>
    )
}

export default AdminPageView
