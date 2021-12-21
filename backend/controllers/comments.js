const db = require('../models/db');
const Post = db.posts;
const User = db.users;
const Comment = db.comments;
const { ValidationError } = require('sequelize');
//const Op = db.Sequelize.Op;

exports.getAllComments = (req, res) => {

    if (req.query.post_id) {
        const postId = parseInt(req.query.post_id);
        // récupération par article
        Post.findByPk(postId)
        .then(post => {
            if (!post) {
                return res.status(401).json({ message: 'La publication n\'existe pas. Vérifiez vos informations puis réessayez.' });
            }
            // Récupère tous les commentaires d'un article qui n'ont pas été modérés
            return Comment.findAndCountAll({
                where: { postId: post.id, moderated: false },
                order: [
                    ['createdAt', 'DESC']
                ],
                include:{ 
                    model: User,
                    attributes: ['id', 'firstName', 'lastName', 'photo'],
                    required: true
                }
            })
            .then(comments => {
                if (comments.count === 0) {
                    return res.status(404).json({ message: 'Il n\'y a pas de commentaires associés à cette publication.' })
                }
                return res.status(200).json({ comments });
            })
        })
        .catch(error => {
            return res.status(401).json({ error: error.message, message: 'Il y a eu une erreur, réessayez plus tard.' });
        })
    } else if (req.query.user_id) {
        const userId = parseInt(req.query.user_id);
        if (userId === req.token.userId) {
            // récupération par auteur
            Post.findOne({ where : { userId: userId }})
            .then(post => {
                if (!post) {
                    return res.status(401).json({ message: 'La publication n\'existe pas. Vérifiez vos informations puis réessayez.' });
                }
                // Récupère tous les commentaires d'un utilisateur qui n'ont pas été modérés
                return Comment.findAndCountAll({
                    where: { userId: post.userId, moderated: false },
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include:{ 
                        model: Post,
                        required: true
                    }
                })
                .then(comments => {
                    if (comments.count === 0) {
                        return res.status(404).json({ message: 'Il n\'y a pas de commentaires associés à cet  utilisateur.' })
                    }
                    return res.status(200).json({ comments });
                })
            })
            .catch(error => {
                return res.status(401).json({ error, message: 'Il y a eu une erreur, réessayez plus tard.' });
            })
        } else {
            return res.status(403).json({ message: 'Cette action vous est interdite. Vérifiez vos informations.' });
        }
    } else {
        res.status(403).json({ message: 'Invalid request !' });
    }
};

exports.postNewComment = (req, res) => {
    const userId = req.body.userId;
    const postId = parseInt(req.body.postId);
    const media = req.body.imgLink ? req.body.imgLink : null;

    if (userId === req.token.userId) {
        if (!req.body) {
            return res.status(401).json({ message: 'Les données semblent absentes. Vérifiez vos informations puis réessayez.' });
        }
        Post.findOne({ where: {id: postId},
            attributes: ['id'],
        })
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Publication non trouvée ! Vérifiez vos informations puis réessayez.' });
            }
            const body = {
                content: req.body.content,
                media: media,
                userId: req.token.userId,
                postId: post.id
            }
            Comment.create(body)
            .then(() => {
                res.status(201).json({ message: 'Votre commentaire a bien été ajouté !'})
            })
            .catch(error => {
                if (error instanceof ValidationError) {
                    return res.status(401).json({message: error.message})
                }
                res.status(500).json({ error: error, message: 'Il y a eu une erreur, réessayez plus tard.' });
            })
        })
        
    } else {
        return res.status(403).json({ message: 'Vous n\'avez pas les droits nécessaires pour effectuer cette action.' });
    }
};

exports.updateComment = (req, res) => {
    const commentId = req.params.id;
    const media = req.body.imgLink ? req.body.imgLink : null;

    Comment.findByPk(commentId)
    .then(comment => {
        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé.' });
        }

        if (req.query.signal) {
            if (req.query.signal === 'true') {
                return Comment.update({ signaled: Date.now() }, { where: { id: commentId } })
                .then(() => {
                    res.status(200).json({ message: 'Ce commentaire a bien été signalé. Merci.' });
                })
                .catch(error => res.status(401).json({ message: error.message }));
            } else if (req.token.userRole === 'moderator' && req.query.signal === 'false') {
                return Comment.update({ signaled: null }, { where: { id: commentId } })
                .then(() => {
                    res.status(200).json({ message: 'Le commentaire a bien été modifié' });
                })
                .catch(error => res.status(401).json({ message: error.message }));
            }
        }

        if (req.query.moderate && req.token.userRole === 'moderator') {
            if (req.query.moderate === 'true') {
                return Comment.update({ moderated: true }, { where: { id: commentId } })
                .then(() => {
                    res.status(200).json({ message: 'Ce commentaire a bien été modéré et ne sera plus affiché. Merci.' });
                })
                .catch(error => res.status(401).json({ message: error.message }));
            } else if (req.query.moderate === 'false') {
                return Comment.update({ moderated: false }, { where: { id: commentId } })
                .then(() => {
                    res.status(200).json({ message: 'Ce commentaire a bien été corrigé et sera réaffiché.' });
                })
                .catch(error => res.status(401).json({ message: error.message }));
            }
        }

        if (req.token.userId === comment.userId) {
            if (media) {
                return Comment.update({ content: req.body.content, media: media, updatedAt: Date.now()}, { where: { id: commentId } })
                .then(() => {
                    res.status(200).json({ message: 'Votre commentaire a bien été modifié' });
                })
                .catch(error => res.status(401).json({ message: error.message }));
            } else {
                return Comment.update({ content: req.body.content, updatedAt: Date.now()}, { where: { id: commentId } })
                .then(() => {
                    res.status(200).json({ message: 'Votre commentaire a bien été modifié' });
                })
                .catch(error => res.status(401).json({ message: error.message }));
            }
        }
    })
    .catch(error => res.status(400).json({ message: error.message }));
};

exports.deleteComment = (req, res) => {
    const commentId = parseInt(req.params.id);
    const userId = parseInt(req.token.userId);

    Comment.findByPk(commentId)
    .then(comment => {
        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé.' });
        }
        if ( comment.userId === userId || req.token.userRole === 'moderator') {
            return Comment.destroy({ where: {id: commentId} })
            .then(() => {
                res.status(200).json({ message: `Le commentaire a bien été supprimé` });
            })
        } else {
            res.status(401).json({ message: 'Vous ne pouvez pas supprimer ce commentaire s\'il ne vous appartient pas.' });
        }
    })
    .catch(error => res.status(500).json({ message: 'Il y a eu une erreur, veuillez réessayer.', error }));
};
