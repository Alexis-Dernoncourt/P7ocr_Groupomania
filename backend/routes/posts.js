const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer-config');

const postCtrl = require('../controllers/posts');

router.get('/', auth, postCtrl.getAllPosts); 
router.get('/:id', auth, postCtrl.getPostById);
router.get('/all-posts/:id', auth, postCtrl.getUserPosts); //récupère tous les posts de l'utilisateur connecté via son id pour affichage dans son espace personnel

router.post('/', auth, upload.single('image'), postCtrl.createPost);
router.put('/:id', auth, upload.single('image'), postCtrl.updatePost);
router.delete('/delete/:id', auth, postCtrl.deletePost);
router.post('/signal/:id', auth, postCtrl.signalPost);
router.post('/moderate/:id', auth, postCtrl.moderatePost);


module.exports = router;
