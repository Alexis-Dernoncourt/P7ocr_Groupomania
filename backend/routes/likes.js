const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const likesCtrl = require('../controllers/likes');

router.get('/', auth, likesCtrl.getLikes);
router.post('/like', auth, likesCtrl.addLike);
//router.delete('/unlike', auth, likesCtrl.deleteLike);

module.exports = router;
