const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
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

db.users.hasMany(db.comments, {onDelete: 'cascade'});
db.comments.belongsTo(db.users);
db.posts.hasMany(db.comments, {onDelete: 'cascade'});
db.comments.belongsTo(db.posts);

db.posts.hasMany(db.likes, {onDelete: 'cascade'});
db.likes.belongsTo(db.posts);
db.comments.hasMany(db.likes, {onDelete: 'cascade'});
db.likes.belongsTo(db.comments);
db.users.hasMany(db.likes, {onDelete: 'cascade'});
db.likes.belongsTo(db.users);

module.exports = db;
