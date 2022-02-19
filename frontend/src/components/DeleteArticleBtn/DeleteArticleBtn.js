import { useNavigate } from "react-router-dom";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useDeleteOnePostMutation } from '../../redux/apiSlice';
import toast from 'react-hot-toast';

const DeleteArticleBtn = ({ post_id, showDeleteArticleConfirmBtn, setShowDeleteArticleConfirmBtn, setIdOfArticleToDelete, pathToRedirect }) => {
    const navigate = useNavigate();
    const [ deleteOnePost, data ] = useDeleteOnePostMutation();
    
    const deleteArticle = async () => {
        try {
            const payload = await deleteOnePost(post_id).unwrap();
            toast.success(payload.message);
            setShowDeleteArticleConfirmBtn(false);
            navigate(pathToRedirect);
        } catch (error) {
            toast.error(error.data.message);
            setShowDeleteArticleConfirmBtn(false);
            navigate(pathToRedirect);
        }
    };

    const hide = () => {
        setShowDeleteArticleConfirmBtn(false);
        setIdOfArticleToDelete(null);
    };

    return (
        <div className={`modal ${showDeleteArticleConfirmBtn && 'is-flex'} `}>
            <div className="modal-background"></div>
            <div className={`modal-content ${showDeleteArticleConfirmBtn && 'box has-background-white py-6'} `}>
                {
                    data.isLoading && <LoadingSpinner />
                }
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
