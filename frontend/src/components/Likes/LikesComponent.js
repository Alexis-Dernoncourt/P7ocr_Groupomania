
const LikesComponent = ({ likes, setLikedPost, setUnlikedPost, postId, setInfoMessage }) => {
    const userId = parseInt(localStorage.getItem('user_id'));
    const token = localStorage.getItem('token');

    const userLiked = likes.filter(el => el.userId === userId);
    
    const like = () => {
        if (userLiked.length > 0) {
            setUnlikedPost(0);
            setLikedPost(0);
            unlikePost();
        } else {
            setLikedPost(0);
            setUnlikedPost(0);
            likePost();
        }
    };

    const unlikePost = () => {
        fetch(`/api/likes/unlike?post_id=${postId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            method: "DELETE",
            body: JSON.stringify({"userId": userId})
        })
        .then(res => res.json())
        .then(unliked => {
            setUnlikedPost(unliked.id);
            setInfoMessage(unliked.message);
        })
        .catch(error => console.log(error))
    };

    const likePost = () => {
        fetch(`/api/likes/like?post_id=${postId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({"userId": userId})
        })
        .then(res => res.json())
        .then(postedLike => {
            setLikedPost(postedLike.id);
            setInfoMessage(postedLike.message);
        })
        .catch(error => console.log(error))
    };

    
    return (
        <>
            <span onClick={() => like()} className='like is-clickable'><i className={`${userLiked.length > 0 ? 'fas fa-heart redHeart animationLike' : 'far fa-heart unlikeAnim'}`}></i></span>
            <span className='totalLikes'>{likes.length}</span>
        </>
    )
}

export default LikesComponent
