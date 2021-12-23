const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const Likes = sequelize.define('like', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                is: {
                    args: [/[0-9]*/],
                    msg: 'Ce champs ne doit comporter que des chiffres.'
                },
                notNull: {msg: 'Il faut renseigner l\'id de l\'auteur du like pour pouvoir continuer.'}
            }
        },

        postId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            validate: {
                is: {
                    args: [/[0-9]*/],
                    msg: 'Ce champs ne doit comporter que des chiffres.'
                }
            }
        },

        commentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            validate: {
                is: {
                    args: [/[0-9]*/],
                    msg: 'Ce champs ne doit comporter que des chiffres.'
                }
            }
        }
    }, {
    // Other model options go here
    });

return Likes;
};
