const express = require('express');
const path = require("path");
const db = require('./models/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const likesRoutes = require('./routes/likes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

// DB CONNEXION
db.sequelize.sync()
.then(() => {
    console.log('Connection to the DB has been established successfully.');
})
.catch(error => {
    console.log('Unable to connect to the database:', error.parent.sqlMessage, '. Please verify and retry...');
})


app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likesRoutes);

app.use(({res}) => {
    const message = 'Impossible de trouver la ressource demandée. Vérifiez l\'URL puis réessayez.';
    res.status(404).json({message});
})

module.exports = app;
