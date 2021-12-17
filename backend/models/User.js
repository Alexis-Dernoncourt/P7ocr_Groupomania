const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: {
                args: [/^[a-z- _àâäëêéèçûüôö]+$/i],
                msg: 'Uniquement des caractères - avec espace(s) et/ou tiret(s) (les chiffres et caractères spéciaux ne sont pas autoriés)'
            },
            not: {
                args: [/^select$|^get$|^delete$|script|put1|putain|putin|pute|fdp|pd|^ducon$|con$|conne$|^connasse$|garce|^batar|bâtard|^encul|enkul|enqul|^salau|^bite$|^cul|couille|^chier$|dugland|glandu/i],
                msg: 'Votre message contient des insultes ou mot(s) interdit(s), veuillez le corriger...'
            },
            notEmpty: {msg: 'Ce champs ne doit pas être vide.'},
            notNull: {msg: 'Ce champs est requis.'},
            min: {
                args: [1],
                mgs: 'Veuillez entrer au minimum 1 caractère pour ce champs.'
            },
            max: {
                args: [65],
                mgs: 'Veuillez ne pas entrer  plus de 65 caractères pour ce champs.'
            }
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: {
                args: [/^[a-z- _àâäëêéèçûüôö]+$/i],
                msg: 'Uniquement des caractères - avec espace(s) et/ou tiret(s) (les chiffres et caractères spéciaux ne sont pas autoriés)'
            },
            not: {
                args: [/^select$|^get$|^delete$|script|put1|putain|putin|pute|fdp|pd|^ducon$|con$|conne$|^connasse$|garce|^batar|bâtard|^encul|enkul|enqul|^salau|^bite$|^cul|couille|^chier$|dugland|glandu/i],
                msg: 'Votre message contient des insultes ou mot(s) interdit(s), veuillez le corriger...'
            },
            notEmpty: {msg: 'Ce champs ne doit pas être vide.'},
            notNull: {msg: 'Ce champs est requis.'},
            min: {
                args: [1],
                mgs: 'Veuillez entrer au minimum 1 caractère pour ce champs.'
            },
            max: {
                args: [150],
                mgs: 'Veuillez ne pas entrer  plus de 150 caractères pour ce champs.'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {msg: 'Ce champs doit contenir une adresse email valide (ex: abc@mail.com)'},
            notEmpty: {msg: 'Ce champs ne doit pas être vide.'},
            notNull: {msg: 'Ce champs est requis.'},
            not: {
                args: [/^select$|^get$|^delete$|script|put1|putain|putin|pute|fdp|pd|^ducon$|con$|conne$|^connasse$|garce|^batar|bâtard|^encul|enkul|enqul|^salau|^bite$|^cul|couille|^chier$|dugland|glandu/i],
                msg: 'Votre message contient des insultes ou mot(s) interdit(s), veuillez le corriger...'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()+,-./:;=?@\[\]^_`{|}~])[A-Za-z0-9!#$%&()+,-./:;=?@\[\]^_`{|}~]{8,}$/,
            notEmpty: {msg: 'Ce champs ne doit pas être vide.'},
            notNull: {msg: 'Ce champs est requis.'},
            not: {
                args: [/^select$|^get$|^delete$|script|put1|putain|putin|pute|fdp|pd|^ducon$|con$|conne$|^connasse$|garce|^batar|bâtard|^encul|enkul|enqul|^salau|^bite$|^cul|couille|^chier$|dugland|glandu/i],
                msg: 'Votre message contient des insultes ou mot(s) interdit(s), veuillez le corriger...'
            }
        }
    },
    photo: {
        type: DataTypes.STRING,
        defaultValue: "http://localhost:4000/images/base-avatar.png",
        validate: {
            not: {
                args: [/^select$|^get$|^delete$|script|put1|putain|putin|pute|fdp|pd|^ducon$|con$|conne$|^connasse$|garce|^batar|bâtard|^encul|enkul|enqul|^salau|^bite$|^cul|couille|^chier$|dugland|glandu/i],
                msg: 'Votre message contient des insultes ou mot(s) interdit(s), veuillez le corriger...'
            }
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "basic"
    },
    }, {
    // Other model options go here
    });

    return User;
};
