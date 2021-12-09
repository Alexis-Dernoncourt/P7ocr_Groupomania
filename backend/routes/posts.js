const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer-config');

const postCtrl = require('../controllers/posts');

router.get('/', postCtrl.getAllPosts);
router.get('/:id', postCtrl.getPostsById);
router.post('/', postCtrl.createPost);


module.exports = router;
