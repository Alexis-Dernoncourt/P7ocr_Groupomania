import { useNavigate } from "react-router-dom";

const DeleteArticleBtn = ({ post_id, showDeleteArticleConfirmBtn, setShowDeleteArticleConfirmBtn, setIdOfArticleToDelete, arrayOfDeletedPosts, setArrayOfDeletedPosts, pathToRedirect, setInfoMessage }) => {

    const navigate = useNavigate();

    const deleteArticle = () => {
        fetch(`/api/posts/delete/${post_id}`, {
            headers: {
                'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            },
            method: "DELETE"
        })
        .then(data => data.json())
        .then(response => {
            setArrayOfDeletedPosts([...arrayOfDeletedPosts, post_id]);
            setShowDeleteArticleConfirmBtn(false);
            setIdOfArticleToDelete(null);
            navigate(pathToRedirect);
            setInfoMessage(response.message);
        })
        .catch(error => console.log(error))
    };

    const hide = () => {
        setShowDeleteArticleConfirmBtn(false);
        setIdOfArticleToDelete(null);
    };

    return (
        <div className={`modal ${showDeleteArticleConfirmBtn && 'is-flex'} `}>
            <div className="modal-background"></div>
            <div className={`modal-content ${showDeleteArticleConfirmBtn && 'box has-background-white py-6'} `}>
                <p className="is-size-5 has-text-danger has-text-centered has-text-weight-bold mb-1">Voulez-vous vraiment supprimer cet article ?</p>
                <p className="is-size-6 has-text-dark has-text-centered has-text-weight-semibold mb-5">Attention : cette action est définitive.</p>
                <div className="is-flex is-flex-direction-row is-justify-content-center has-text-centered">
                    <button className="button is-rounded is-danger is-outlined has-text-size-bold has-text-weight-semibold is-uppercase mx-3" onClick={deleteArticle}>Oui</button>
                    <button className="button is-rounded is-primary is-outlined has-text-size-bold has-text-weight-semibold is-uppercase mx-3" onClick={hide}>Non</button>
                </div>
            </div>
            <button onClick={hide} className="modal-close is-large" aria-label="close"></button>
        </div>
    )
}

export default DeleteArticleBtn
