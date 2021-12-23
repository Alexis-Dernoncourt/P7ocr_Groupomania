const { DataTypes } = require('sequelize');

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
                    args: [/^[0-9a-z- _-àâäëêéèçûüôö.,;:)'"&?!]*$/i],
                    msg: 'Uniquement des caractères et des chiffres, avec espace(s) et/ou tiret(s) (sauf \', ", &, ?, et !, les caractères spéciaux ne sont pas autoriés)'
                },
                not: {
                    args: [/^select$|^get$|^delete$|script|put1|putain|putin|pute|fdp|pd|^ducon$|con$|conne$|^connasse$|garce|^batar|bâtard|^encul|enkul|enqul|^salau|^bite$|^cul|couille|^chier$|dugland|glandu/i],
                    msg: 'Votre message contient des insultes ou mot(s) interdit(s), veuillez le corriger...'
                }
            }
        },

        media: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                not: {
                    args: [/^select$|^get$|^delete$|script|put1|putain|putin|pute|fdp|pd|^ducon$|con$|conne$|^connasse$|garce|^batar|bâtard|^encul|enkul|enqul|^salau|^bite$|^cul|couille|^chier$|dugland|glandu/i],
                    msg: 'Votre message contient des insultes ou mot(s) interdit(s), veuillez le corriger...'
                }
            }
        },

        signaled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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