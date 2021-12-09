const { DataTypes } = require('sequelize');
const { posts } = require('./db');

module.exports = (sequelize) => {

    const Post = sequelize.define('post', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        content: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                is: {
                    args: [/^[0-9a-z- _-àâäëêéèçûüôö.,;:'"&?!]+$/i],
                    msg: 'Uniquement des caractères et des chiffres, avec espace(s) et/ou tiret(s) (sauf \', ", &, ?, et !, les caractères spéciaux ne sont pas autoriés)'
                }
            }
        },

        media: {
            type: DataTypes.STRING,
            allowNull: true
        },

        moderated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {msg: 'Ce champs ne doit pas être vide.'},
                notNull: {msg: 'Il faut renseigner l\'id de l\'auteur pour pouvoir continuer.'}
            }
        }
    }, {
    // Other model options go here
    });

return Post;
};