const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const likesCtrl = require('../controllers/likes');

router.get('/', auth, likesCtrl.getLikes);
router.post('/add', auth, likesCtrl.addLikes);
router.delete('/delete', auth, likesCtrl.deleteLikes);

module.exports = router;
