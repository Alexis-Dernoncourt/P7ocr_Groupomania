const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('groupomania_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./User.js")(sequelize, Sequelize);
db.posts = require("./Post.js")(sequelize, Sequelize);
db.comments = require("./Comments.js")(sequelize, Sequelize);
db.likes = require("./Likes.js")(sequelize, Sequelize);

db.users.hasMany(db.posts);
db.posts.belongsTo(db.users);

db.users.hasMany(db.comments);
db.comments.belongsTo(db.users);
db.posts.hasMany(db.comments);
db.comments.belongsTo(db.posts);

db.posts.hasMany(db.likes);
db.likes.belongsTo(db.posts);
db.comments.hasMany(db.likes);
db.likes.belongsTo(db.comments);
db.users.hasMany(db.likes);
db.likes.belongsTo(db.users);

module.exports = db;
