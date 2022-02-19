const db = require('../models/db');
const User = db.users;
const { ValidationError } = require('sequelize');
const fs = require('fs');

exports.getProfile = (req, res) => {
    const userId = req.token.userId;
    const expToken = req.token.exp;
    // récupère uniquement les éléments utiles (pas le password)
    User.findOne({attributes: ['id', 'firstName', 'lastName', 'email', 'photo', 'role', 'createdAt', 'updatedAt'], where: { id: userId } })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé ! Vérifiez vos informations ou créez un compte.' });
        }
        res.status(200).json({ user, expToken: expToken });
    })
    .catch(error => res.status(500).json({ error, message: 'Il y a eu une erreur, réessayez plus tard.' }));
};

exports.updateProfile = (req, res) => {
    const id = parseInt(req.params.id);
    const tokenID = req.token.userId;
    
    if (id === tokenID) {
        if (req.file && req.file.filename !== undefined) {
            User.findOne({ where: { id: id } })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ message: 'Utilisateur non trouvé ! Vérifiez vos informations ou créez un compte.' });
                }
                const currentPhoto = user.photo.split('/images/')[1];
                const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                if (currentPhoto !== "base-avatar.png") {
                    fs.unlink(`images/${currentPhoto}`, () => {
                        User.update({...req.body, photo: imageUrl, updatedAt: Date.now()}, { where: { id: id } })
                        .then(() => {
                            res.status(200).json({ user: user, photo: imageUrl, message: 'Votre profil a bien été modifié - 1' });
                        })
                        .catch(error => res.status(401).json({ message: error.message }));
                    })
                } else {
                    User.update({...req.body, photo: imageUrl, updatedAt: Date.now()}, { where: { id: id } })
                    .then(() => {
                        res.status(200).json({ user: user, photo: imageUrl, message: 'Votre profil a bien été modifié - 2' });
                    })
                    .catch(error => res.status(401).json({ message: error.message }));
                }
            })
            .catch(error => {
                if (error instanceof ValidationError) {
                    return res.status(400).json({message: error.message})
                }
                res.status(500).json({ error });
            });

            
        } else {
            console.log(req.body);
            User.update({ firstName: req.body.firstName, lastName: req.body.lastName, updatedAt: Date.now() }, { where: { id: id } })
            .then(() => {
                User.findByPk(id)
                .then(user => {
                    if (!user) {
                        return res.status(401).json({ message: 'Utilisateur non trouvé! Vérifiez vos informations ou créez un compte.' });
                    }
                    res.status(200).json({ message: 'Votre profil a bien été modifié' });
                })
            })
            .catch(error => {
                if (error instanceof ValidationError) {
                    return res.status(400).json({message: error.message})
                }
                res.status(500).json({ error: error.message });
            });
        }
    }
    else {
        res.status(403).json({ message: 'Vous n\'êtes pas autorisé(e) à effectuer cette action.' });
    }
};

exports.deleteProfile = (req, res) => {
    const id = parseInt(req.params.id);
    const tokenId = req.token.userId;
    if ( id === tokenId) {
        User.findByPk(id)
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé! Vérifiez vos informations ou créez un compte.' });
            }
            const currentPhoto = user.photo.split('/images/')[1];
            if (currentPhoto !== "base-avatar.png") {
                fs.unlink(`images/${currentPhoto}`, () => {
                    return User.destroy({ where: { id: id } })
                    .then(() => {
                        res.status(200).json({ message: `Le profil de ${user.firstName} ${user.lastName} a bien été supprimé` });
                    })
                })
            } else {
                return User.destroy({ where: {id: id} })
                .then(() => {
                    res.status(200).json({ message: `Le profil de ${user.firstName} ${user.lastName} a bien été supprimé` });
                })
            }
        })
        .catch(error => res.status(500).json({ message: 'Il y a eu une erreur, veuillez réessayer.', error }));
    } else {
        res.status(401).json({ message: 'Vous ne pouvez pas supprimer ce profil. Réessayez plus tard.' });
    }
}

// exports.getAllProfiles = (_, res) => {
//     User.findAll({attributes: ['id', 'firstName', 'lastName', 'email', 'photo', 'role', 'createdAt', 'updatedAt']})
//     .then(users => {
//         res.status(200).json({ users });
//     })
//     .catch(error => res.status(500).json({ error }));
// };
