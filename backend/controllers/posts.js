const db = require('../models/db');
const Post = db.posts;
const User = db.users;
const Comment = db.comments;
const Like = db.likes;
const { ValidationError } = require('sequelize');
const fs = require('fs');
const Op = db.Sequelize.Op;

exports.getAllPosts = (req, res) => {
    const user_role = req.token.userRole;

    if (req.query.signaled && req.query.signaled === 'true' && req.query.moderated && req.query.moderated === 'false') {
        if (user_role === 'moderator') {
            // Récupère tous les articles signalés qui n'ont pas été modérés
            return Post.findAll({ where: {
                                [Op.and]: [
                                    { signaled: true },
                                    { moderated: false }
                                ]},
                                order: [
                                    ['createdAt', 'DESC']
                                ]
            })
            .then(posts => {
                return res.status(200).json({ posts, user_role });
            })
            .catch(error => res.status(500).json({ error, message: 'Il y a eu une erreur, réessayez plus tard.' }))
        } else {
           return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à effectuer cette action, désolé.'})
        }
    }

    // Récupère tous les articles qui n'ont pas été modérés (avec l'auteur associé)
    // ainsi que les commentaires associés (s'il y en a) qui n'ont pas été modérés (avec auteur du commentaire)
    Post.findAll({  where: {moderated: false},
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include:[
                        {   model: User,
                            attributes: ['id', 'firstName', 'lastName', 'photo'],
                            required: true
                        },
                        {
                            model: Like
                        },
                        {   model: Comment,
                            where: { moderated: false},
                            order: [
                                ['createdAt', 'DESC']
                            ],
                            limit: 3,
                            include: {
                                model: User,
                                attributes: ['id', 'firstName', 'lastName', 'photo'],
                                required: true
                            }
                        }
                    ]
                })
    .then(posts => {
        return res.status(200).json({ posts, user_role });
    })
    .catch(error => res.status(500).json({ error, message: 'Il y a eu une erreur, réessayez plus tard.' }))
};

exports.getUserPosts = (req, res) => {
    const userId = parseInt(req.params.id);
    const tokenID = req.token.userId;
    const user_role = req.token.userRole;
    
    Post.findAll({  where: { userId: userId },
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include:{   model: User,
                                attributes: ['id', 'firstName', 'lastName', 'photo'],
                                required: true
                            }
                })
    .then(posts => {
        if (!posts) {
            return res.status(404).json({ message: 'Publication non trouvée ! Vérifiez vos informations puis réessayez.' });
        }
        if (tokenID === userId) {
            res.status(200).json({ posts, user_role, message: `Voici tous les posts de l'utilisateur avec l'id ${userId}`});
        } else {
            res.status(401).json({ message: 'Vous n\'êtes pas autorisé(e) à effectuer cette action.' });
        }
    })
    .catch(error => res.status(500).json({ error: error.original.sqlMessage, message: 'Il y a eu une erreur, réessayez plus tard.' }));
};

exports.getPostById = (req, res) => {
    const postId = req.params.id;
    const user_role = req.token.userRole;
    Post.findOne({  where: { id: postId },
                    include:[{
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'photo'],
                        required: true
                    },
                    {
                        model: Like
                    },
                    {   model: Comment,
                        where: { moderated: false },
                        order: [
                            ['createdAt', 'DESC']
                        ],
                        required: false,
                        include: {
                            model: User,
                            attributes: ['id', 'firstName', 'lastName', 'photo'],
                            required: true
                        }
                    }]
                })
    .then(post => {
        if (!post) {
            return res.status(404).json({ message: 'Publication non trouvée ! Vérifiez vos informations puis réessayez.' });
        }
        if (post.moderated) {
            return res.status(401).json({ message: 'Vous ne pouvez pas voir cette publication car elle a été modérée.' });
        }
        res.status(200).json({ post, user_role });
    })
    .catch(error => res.status(500).json({ error: error.original.sqlMessage, message: 'Il y a eu une erreur, réessayez plus tard.' }));
};

exports.createPost = (req, res) => {
    const userId = parseInt(req.body.user_id);
    if (userId === req.token.userId) {
        if (!req.body) {
            return res.status(401).json({ message: 'Les données semblent absentes ! Vérifiez vos informations puis réessayez.' });
        }
        if (req.file && req.file.filename !== undefined) {
            const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            const body = {
                content: req.body.content,
                media: imageUrl,
                userId: req.token.userId
            };
            Post.create(body)
                .then(() => {
                    res.status(201).json({ message: 'Votre publication a bien été ajoutée !'})
                })
                .catch(error => {
                    if (error instanceof ValidationError) {
                        return res.status(400).json({message: error.message})
                    }
                    res.status(500).json({ error: error, message: 'Il y a eu une erreur, réessayez plus tard.' });
                })
        } else {
            const media = req.body.imgLink ? req.body.imgLink : null;
            Post.create({content: req.body.content, media: media, userId: req.token.userId})
            .then(() => {
                res.status(201).json({ message: 'Votre publication a bien été ajoutée !'})
            })
            .catch(error => {
                if (error instanceof ValidationError) {
                    return res.status(400).json({message: error.message})
                }
                res.status(500).json({ error: error, message: 'Il y a eu une erreur, réessayez plus tard.' });
            })
        }
    } else {
        return res.status(403).json({ message: 'Vous n\'avez pas les droits nécessaires pour effectuer cette action.' });
    }
};

exports.updatePost = (req, res) => {
    const postId = parseInt(req.params.id);
    const tokenID = req.token.userId;
    const media = req.body.imgLink ? req.body.imgLink : null;

    if (req.headers['content-length'] > 8000000) {
        return res.status(401).json({ message: 'La taille du fichier est trop grande. L\'image doit être inférieure à 8 Mo.'})
    }    
    Post.findByPk(postId)
    .then(post => {
        if (!post) {
            return res.status(404).json({ message: 'Publication non trouvée ! Vérifiez vos informations puis réessayez.' });
        }
        if (post.userId === tokenID) {
            if (!req.body.content && !media) { 
                return res.status(401).json({ message: 'Les champs ne semblent pas avoir été modifiés. Vérifiez vos informations puis réessayez.' });
            }
            if (req.file && req.file.filename !== undefined) {
                const currentPhoto = post.media ? post.media.split('/images/')[1] : false;
                const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                if (currentPhoto) {
                    fs.unlink(`images/${currentPhoto}`, () => {
                        return Post.update({content: req.body.content, media: imageUrl, updatedAt: Date.now()}, { where: { id: post.id } })
                        .then(() => {
                            res.status(200).json({ message: 'Votre publication a bien été modifiée !' });
                        })
                        .catch(error => res.status(401).json({ error: error.message, message: 'Il y a eu une erreur, réessayez plus tard.' }));
                    })
                } else {
                    return Post.update({content: req.body.content, media: imageUrl, updatedAt: Date.now()}, { where: { id: post.id } })
                    .then(() => {
                        res.status(200).json({ message: 'Votre publication a bien été modifiée !' });
                    })
                    .catch(error => res.status(500).json({ error: error.message , message: 'Il y a eu une erreur, réessayez plus tard.' }));
                }
            } else {
                if (media) {
                    const currentPhoto = post.media ? post.media.split('/images/')[1] : false;
                    if (currentPhoto) {
                        fs.unlink(`images/${currentPhoto}`, () => {
                            Post.update({content: req.body.content, media: media, updatedAt: Date.now()}, { where: { id: post.id } })
                            .then(() => {
                                res.status(200).json({ message: 'Votre publication a bien été modifiée !' });
                            })
                            .catch(error => res.status(401).json({ error: error.message, message: 'Il y a eu une erreur, réessayez plus tard.' }));
                        })
                    } else {
                        Post.update({ content: req.body.content, media: media, updatedAt: Date.now()}, { where: { id: post.id } })
                        .then(() => {
                            res.status(200).json({ message: 'Votre publication a bien été modifiée !' });
                        })
                        .catch(error => res.status(500).json({ error: error.message, message: 'Il y a eu une erreur, réessayez plus tard.' }));
                    }
                    
                } else {
                    Post.update({content: req.body.content, updatedAt: Date.now()}, { where: { id: post.id } })
                    .then(() => {
                        res.status(200).json({ message: 'Votre publication a bien été modifiée !' });
                    })
                    .catch(error => res.status(500).json({ error: error.message, message: 'Il y a eu une erreur, réessayez plus tard.' }));
                }
            }
        } else {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé(e) à effectuer cette action.' });
        }
    })
    .catch(error => res.status(500).json({ error: error.message, message: 'Il y a eu une erreur. Vérifiez vos informations puis réessayez.' }));
};

exports.deletePost = (req, res) => {
    const postId = parseInt(req.params.id);
    const tokenId = req.token.userId;
    const user_role = req.token.userRole;
    Post.findByPk(postId)
    .then(post => {
        if (!post) {
            return res.status(401).json({ message: 'Publication non trouvée! Vérifiez vos informations puis réessayez.' });
        }         
        if (tokenId === post.userId || user_role === 'moderator') {
            const host = process.env.PORT || '4000';
            if (post.media && post.media.indexOf(host) !== -1) {
                const currentPhoto = post.media.split('/images/')[1];
                fs.unlink(`images/${currentPhoto}`, () => {
                    return Post.destroy({ where: {id: postId} })
                    .then(() => {
                        res.status(200).json({ message: `La publication id ${postId} a bien été supprimée !` });
                    })
                    .catch(error => res.status(400).json({ message: 'Il y a eu une erreur, veuillez réessayer.', error }));
                })
            } else {
                return Post.destroy({ where: {id: postId} })
                .then(() => {
                    res.status(200).json({ message: `La publication id ${postId} a bien été supprimée !` });
                })
                .catch(error => res.status(400).json({ message: 'Il y a eu une erreur, veuillez réessayer.', error }));
            }
        } else {
            res.status(401).json({ message: 'Vous ne pouvez pas supprimer cette publication. Vérifiez vos informations puis réessayez.' });
        }
    })
    .catch(error => res.status(500).json({ error: error.original.sqlMessage, message: 'Il y a eu une erreur, réessayez plus tard.' }));
};

exports.signalPost = (req, res) => {
    const postId = req.params.id;
    Post.findByPk(postId)
    .then(post => {
        if (!post) {
            return res.status(401).json({ message: 'Publication non trouvée. Vérifiez votre demande avant de réessayer.' });
        }
        if (post.signaled) {
            return res.status(403).json({ message: 'Cette publication a déjà été signalée.' });
        }
        Post.update({ signaled: true }, { where: { id: postId } })
        .then(() => {
            return res.status(200).json({ message: 'La publication a bien été signalée. Merci.' });
        })
    })
    .catch(error => res.status(500).json({ error: error.original.sqlMessage, message: 'Il y a eu une erreur, réessayez plus tard.' }));
};

exports.moderatePost = (req, res) => {
    const postId = req.params.id;
    const user_role = req.token.userRole;
    if (user_role === 'moderator') {
        Post.findByPk(postId)
        .then(post => {
            if (!post) {
                return res.status(401).json({ message: 'Publication non trouvée. Vérifiez votre demande avant de réessayer.' });
            }
            if (post.moderated) {
                return res.status(403).json({ message: 'Cette publication a déjà été modérée.' });
            }
    
            Post.update({ moderated: true }, { where: { id: postId } })
            .then(() => {
                return res.status(200).json({ message: 'La publication a bien été modérée et ne sera plus affichée. Merci.' });
            })
        })
        .catch(error => res.status(500).json({ error: error.original.sqlMessage, message: 'Il y a eu une erreur, réessayez plus tard.' }));
    } else {
        return res.status(403).json({ message: 'Vous n\'avez pas les droits nécessaires pour effectuer cette action.' });
    }
};
