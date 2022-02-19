import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useDeleteOneCommentMutation } from '../../redux/apiSlice';

const DeleteCommentConfirmBtn = ({ comment_id, showDeleteCommentConfirmBtn, setShowDeleteCommentConfirmBtn, pathToRedirect, refetch }) => {
    const navigate = useNavigate();
    const [ deleteOneComment ] = useDeleteOneCommentMutation();

    const deleteComment = async () => {
        try {
            const payload = await deleteOneComment(comment_id).unwrap();
            toast.success(payload.message);
            refetch && refetch();
            setShowDeleteCommentConfirmBtn(false);
            navigate(pathToRedirect);
        } catch (error) {
            console.log(error);
            console.error('rejected', error.data.error);
            toast.error(error.data.message);
        };
    };

    const hide = () => {
        setShowDeleteCommentConfirmBtn(false);
    };


    return (
        <div className={`modal ${showDeleteCommentConfirmBtn && 'is-flex'} `}>
            <div className="modal-background"></div>
            <div className={`modal-content ${showDeleteCommentConfirmBtn && 'box has-background-white py-6'} `}>
                <p className="is-size-5 has-text-danger has-text-centered has-text-weight-bold mb-1">Voulez-vous vraiment supprimer ce commentaire ?</p>
                <p className="is-size-6 has-text-dark has-text-centered has-text-weight-semibold mb-5">Attention : cette action est définitive.</p>
                <div className="is-flex is-flex-direction-row is-justify-content-center has-text-centered">
                    <button className="button is-rounded is-danger is-outlined has-text-size-bold has-text-weight-semibold is-uppercase mx-3" onClick={deleteComment}>Oui</button>
                    <button className="button is-rounded is-primary is-outlined has-text-size-bold has-text-weight-semibold is-uppercase mx-3" onClick={hide}>Non</button>
                </div>
            </div>
            <button onClick={hide} className="modal-close is-large" aria-label="close"></button>
        </div>
    )
}

export default DeleteCommentConfirmBtn
