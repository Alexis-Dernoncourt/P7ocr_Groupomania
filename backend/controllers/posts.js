const bcrypt = require('bcrypt');
const db = require('../models/db');
const Post = db.posts;
const User = db.users;
//const Op = db.Sequelize.Op;
//const { ValidationError, UniqueConstraintError } = require('sequelize');
//const jwt = require('jsonwebtoken');
//const match = require('../utils/regex');
const fs = require('fs');


exports.getAllPosts = (req, res) => {
    // Affiche tous les articles sauf ceux qui ont été modérés
    Post.findAll({ where: {moderated: false} })
    .then(posts => {
        return res.status(200).json({ posts });
    })
    .catch(error => res.status(500).json({ error, message: 'Il y a eu une erreur, réessayez plus tard.' }))
};

exports.getPostsById = (req, res) => {
    const postId = req.params.id;
    Post.findOne({ where: { id: postId } })
    .then(post => {
        if (!post) {
            return res.status(401).json({ message: 'Publication non trouvée ! Vérifiez vos informations puis réessayez.' });
        }
        if (post.moderated) {
            return res.status(403).json({ message: 'Vous ne pouvez pas voir cette publication car elle a été modérée.' });
        }
        res.status(200).json({ post });
    })
    .catch(error => res.status(500).json({ error, message: 'Il y a eu une erreur, réessayez plus tard.' }));
};

exports.createPost = (req, res) => {
    Post.create(req.body.post)
    .then(ok => {
        res.status(201).json({ ok, message: 'Votre publication a bien été postée !'})
    })
    .catch(error => res.status(500).json({ error, message: 'Il y a eu une erreur, réessayez plus tard.' }));
};
