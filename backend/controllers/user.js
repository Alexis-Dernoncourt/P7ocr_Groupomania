const bcrypt = require('bcrypt');
const db = require('../models/db');
const User = db.users;
const Op = db.Sequelize.Op;
const { ValidationError } = require('sequelize');
const jwt = require('jsonwebtoken');
const match = require('../utils/regex');
const fs = require('fs');

exports.signup = (req, res) => {
  const pwd = req.body.password;
  const mail = req.body.email;
  if (pwd !== "" && mail !== "" && match.regex.passwordCheck.test(pwd) && match.regex.mailCheck.test(mail)) {
    bcrypt.hash(pwd, 10)
        .then(hash => {
            const user = {
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                password: hash,
                createdAt: Date.now()
            }
            return User.create(user)
            .then(() => {
                res.status(201).json({ message: `Utilisateur créé ! Vous pouvez maintenant vous connecter!` })
            })
            //.catch(error => res.status(500).json({ error }));
        })
        .catch(error => {
            if (error instanceof ValidationError) {
                return res.status(400).json({message: error.message, data: error})
            }
            res.status(500).json({ error, data: error })
        });
  } else {
    res.status(401).send({ message: "Email ou mot de passe invalide. Veuillez vérifier vos informations puis réessayez." });
  }
};

exports.login = (req, res) => {   
    const pwd = req.body.password;
    const mail = req.body.email;
    if (pwd !== "" && mail !== "" && match.regex.passwordCheck.test(pwd) && match.regex.mailCheck.test(mail)) {
        User.findOne({ where: { email: mail } })
        .then(user => {
            if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(pwd, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                const token = jwt.sign(
                    { userId: user.id },
                    process.env.TOKEN_SECRET,
                    { expiresIn: '24h' }
                );
                return res.setHeader('Authorization', `Bearer ${token}`).status(200).json({
                    userId: user.id,
                    token
                });
            })
        })
        .catch(error => res.status(500).json({ error }));
    } else {
        const message = 'Mot de passe ou email erroné, veuillez vérifier puis réessayer.';
        res.status(401).json({ message });
    }
};

exports.getProfile = (req, res) => {
    const userId = req.token.userId;
    User.findOne({ where: { id: userId } })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        res.status(200).json({ user });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.updateProfile = (req, res) => {
    const id = parseInt(req.params.id);
    const tokenID = req.token.userId;
    
    if (id === tokenID) {
        if (req.file && req.file.filename !== undefined) {
            User.findOne({ where: { id: id } })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                }
                const currentPhoto = user.photo.split('/images/')[1];
                const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                if(currentPhoto !== "base-avatar.png") {
                    fs.unlink(`images/${currentPhoto}`, () => {
                        User.update({...req.body, photo: imageUrl, updatedAt: Date.now()}, { where: { id: id } })
                        .then(() => {
                            res.status(200).json({ message: 'Votre profil a bien été modifié' });
                        })
                        .catch(error => res.status(401).json({ error }));
                    })
                } else {
                    User.update({...req.body, photo: imageUrl, updatedAt: Date.now()}, { where: { id: id } })
                    .then(() => {
                        res.status(200).json({ message: 'Votre profil a bien été modifié' });
                    })
                    .catch(error => res.status(401).json({ error }));
                }
            })
            .catch(error => {
                if (error instanceof ValidationError) {
                    return res.status(400).json({message: error.message, data: error})
                }
                res.status(500).json({ error });
            });

            
        } else {
            User.update({...req.body, updatedAt: Date.now()}, { where: { id: id } })
            .then(() => {
                User.findByPk(id)
                .then(user => {
                    if (!user) {
                        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                    }
                    res.status(200).json({ user });
                })
            })
            .catch(error => {
                if (error instanceof ValidationError) {
                    return res.status(400).json({message: error.message, data: error})
                }
                res.status(500).json({ error });
            });
        }
    }
    else {
        res.status(401).json({ message: 'Vous n\'êtes pas autorisé à effectuer cette action.' });
    }
};

exports.deleteProfile = (req, res) => {
    const id = parseInt(req.params.id);
    const tokenId = req.token.userId;
    if ( id === tokenId) {
        User.findByPk(id)
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
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

exports.home = (req, res) => {
    User.findAll()
    .then(users => {
        res.status(200).json({ users });
    })
    .catch(error => res.status(500).json({ error }));
};
