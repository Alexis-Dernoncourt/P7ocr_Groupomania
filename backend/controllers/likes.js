const db = require('../models/db');
const Post = db.posts;
const User = db.users;
const Comment = db.comments;
const Like = db.likes;
const { ValidationError } = require('sequelize');

exports.getLikes = (req, res) => {
    if (Object.keys(req.query).length === 1) {

        if (req.query.post_id) {
            const postId = parseInt(req.query.post_id);
            // récupération par article
            Like.findAndCountAll({
                where: { postId: postId },
                order: [
                    ['createdAt', 'DESC']
                ],
                include:{ 
                    model: User,
                    attributes: ['id', 'firstName', 'lastName', 'photo'],
                    required: true
                }
            })
            .then(likes => {
                if (likes.count === 0) {
                    return res.status(404).json({ message: 'Il n\'y a pas de likes associés à cette publication.' })
                }
                return res.status(200).json({ likes, total: likes.count });
            })
            .catch(error => {
                return res.status(401).json({ error: error.message, message: 'Il y a eu une erreur, réessayez plus tard.' });
            })
        } else if (req.query.comment_id) {
            const commentId = parseInt(req.query.comment_id);
            // récupération par commentaires
            Like.findAndCountAll({
                where: { commentId: commentId },
                order: [
                    ['createdAt', 'DESC']
                ],
                include:{ 
                    model: User,
                    attributes: ['id', 'firstName', 'lastName', 'photo'],
                    required: true
                }
            })
            .then(likes => {
                if (likes.count === 0) {
                    return res.status(404).json({ message: 'Il n\'y a pas de likes associés à ce commentaire.' })
                }
                return res.status(200).json({ likes, total: likes.count });
            })
            .catch(error => {
                return res.status(401).json({ error, message: 'Il y a eu une erreur, réessayez plus tard.' });
            })
        } else {
            res.status(403).json({ message: 'Invalid request !' });
        }

    } else {
        return res.status(401).json({ message: 'Il y a trop ou pas assez de paramètre(s) pour cette requête. Vérifiez vos informations avant de réessayer.' });
    }
};

exports.addLike = (req, res) => {
    const userId = parseInt(req.body.userId);
    
    if (userId === req.token.userId) {
        if (!req.body) {
            return res.status(401).json({ message: 'Les données semblent absentes. Vérifiez vos informations puis réessayez.' });
        }
        // Ajout d'un like à un post
        if (req?.query?.post_id) {
            const postId = parseInt(req.query.post_id);
            
            Like.findOne({ where: { postId: postId, userId: req.token.userId }})
            .then(like => {
                if (!like) {
                    return Post.findByPk(postId)
                    .then(post => {
                        if (!post) {
                            return res.status(401).json({ message: 'Bad Request'})
                        } 

                        return Like.create({
                            postId: post.id,
                            userId: req.token.userId
                        })
                        .then(like => {
                            return res.status(201).json({ like, message: 'Votre like a bien été ajouté !' })
                        })
                    })
                    .catch(error => {
                        if (error instanceof ValidationError) {
                            return res.status(401).json({message: error.message})
                        }
                        res.status(500).json({ error: error, message: 'Il y a eu une erreur, réessayez plus tard.' });
                    })
                }
                return res.status(403).json({ message: 'Déjà liké !'})
            })
            .catch(error => {
                res.status(400).json({ error, message: 'Il y a eu une erreur. Veuillez réessayer.'})
            })
        } else if (req?.query?.comment_id) {
        // Ajour d'un like à un commentaire

            const commentId = parseInt(req.query.comment_id);
            
            Like.findOne({ where: { commentId: commentId, userId: req.token.userId }})
            .then(like => {
                if (!like) {
                    return Comment.findByPk(commentId)
                    .then(comment => {
                        if (!comment) {
                            return res.status(401).json({ message: 'Bad Request'})
                        } 

                        return Like.create({
                            commentId: comment.id,
                            userId: req.token.userId
                        })
                        .then(like => {
                            return res.status(201).json({ like, message: 'Votre like a bien été ajouté !' })
                        })
                    })
                    .catch(error => {
                        if (error instanceof ValidationError) {
                            return res.status(401).json({message: error.message})
                        }
                        res.status(500).json({ error: error, message: 'Il y a eu une erreur, réessayez plus tard.' });
                    })
                }
                return res.status(403).json({ message: 'Déjà liké !'})
            })
            .catch(error => {
                res.status(400).json({ error, message: 'Il y a eu une erreur. Veuillez réessayer.'})
            })
        } else {
            return res.status(401).json({ message: 'Il y a eu une erreur, veuillez réessayer.' });
        }
    } else {
        return res.status(403).json({ message: 'Vous n\'avez pas les droits nécessaires pour effectuer cette action.' });
    }
};

exports.deleteLike = (req, res) => {
    const userId = parseInt(req.body.userId);
    console.log(req.query, typeof req.token.userId);
    
    if (userId === req.token.userId) {
        if (!req.query) {
            return res.status(401).json({ message: 'Les données semblent absentes. Vérifiez vos informations puis réessayez.' });
        }
        // Suppression d'un like à un post
        if (req?.query?.post_id) {
            const postId = parseInt(req.query.post_id);
            
            Like.findOne({ where: { postId: postId, userId: req.token.userId }})
            .then(like => {
                if (!like) {
                    return res.status(403).json({ message: 'Action impossible si vous n\'aviez pas liké cet article.'})
                }

                return Post.findByPk(postId)
                .then(post => {
                    if (!post) {
                        return res.status(401).json({ message: 'Bad Request'})
                    } 

                    return Like.destroy({ where: {id: like.id} })
                    .then(() => {
                        return res.status(201).json({ message: 'Votre like a bien été supprimé !' })
                    })
                })
                .catch(err => console.log(err))
            })
            .catch(error => {
                res.status(400).json({ error, message: 'Il y a eu une erreur. Veuillez réessayer.'})
            })
        } else if (req?.query?.comment_id) {
        // Suppression d'un like à un commentaire

            const commentId = parseInt(req.query.comment_id);
            
            Like.findOne({ where: { commentId: commentId, userId: req.token.userId }})
            .then(like => {
                if (!like) {
                    return res.status(403).json({ message: 'Action impossible si vous n\'aviez pas liké ce commentaire.'})
                }

                return Comment.findByPk(commentId)
                .then(comment => {
                    if (!comment) {
                        return res.status(401).json({ message: 'Bad Request'})
                    } 

                    return Like.destroy({ where: {id: like.id} })
                    .then(like => {
                        return res.status(201).json({ like, message: 'Votre like a bien été supprimé !' })
                    })
                })
                .catch(err => console.log(err))
            })
            .catch(error => {
                res.status(400).json({ error, message: 'Il y a eu une erreur. Veuillez réessayer.'})
            })
        } else {
            return res.status(401).json({ message: 'Il y a eu une erreur, veuillez vérifier vos informations avant de réessayer.' });
        }
    } else {
        return res.status(403).json({ message: 'Vous n\'avez pas les droits nécessaires pour effectuer cette action.' });
    }
};
