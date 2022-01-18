const bcrypt = require('bcrypt');
const db = require('../models/db');
const User = db.users;
const { ValidationError, UniqueConstraintError } = require('sequelize');
const jwt = require('jsonwebtoken');
const match = require('../utils/regex');

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
                res.status(201).json({ message: `Utilisateur créé ! Vous pouvez maintenant vous connecter` })
            })
        })
        .catch(error => {
            if (error instanceof ValidationError) {
                if (error instanceof UniqueConstraintError) {
                    return res.status(401).json({ message: `L'email est déjà utilisé. Créez un compte avec une autre adresse mail ou connectez-vous` })
                }
                return res.status(400).json({message: error.message})
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
            return res.status(401).json({ status: 'error', message: `Utilisateur non trouvé! Vérifiez vos informations ou créez un compte.` });
            }
            bcrypt.compare(pwd, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ status: 'error', message: 'Mot de passe incorrect !' });
                }
                const token = jwt.sign(
                    { userId: user.id, userRole: user.role },
                    process.env.TOKEN_SECRET,
                    { expiresIn: '24h' }
                );
                return res.setHeader('Authorization', `Bearer ${token}`).status(200).json({
                    userId: user.id,
                    userRole: user.role,
                    token,
                    message: `Hello ${user.firstName} !`
                });
            })
        })
        .catch(error => res.status(500).json({ status: 'error', message: error.message }));
    } else {
        res.status(401).json({ status: 'error', message: 'Mot de passe ou email erroné, veuillez vérifier puis réessayer.' });
    }
};
