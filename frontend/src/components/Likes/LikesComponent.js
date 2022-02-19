import { useAddOneLikeMutation } from '../../redux/apiSlice';
import { useSelector } from 'react-redux';

const LikesComponent = ({ likes, postId }) => {
    const { userInfos } = useSelector((state) => state.user);
    const [ addOneLike ] = useAddOneLikeMutation();
    const userLiked = likes.filter(el => el.userId === userInfos.id);

    const likePost = async () => {
        try {
            await addOneLike({postId, userId: userInfos.id}).unwrap();
        } catch (error) {
            console.error('rejected', error.data.error);
        };
    };

    
    return (
        <>
            <span onClick={() => likePost()} className='like is-clickable'><i className={`${userLiked.length > 0 ? 'fas fa-heart redHeart animationLike' : 'far fa-heart'}`}></i></span>
            <span className='totalLikes'>{likes.length}</span>
        </>
    )
}

export default LikesComponent
