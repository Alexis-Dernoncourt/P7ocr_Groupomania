const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer-config');

const userCtrl = require('../controllers/user');

router.get('/login', auth, userCtrl.home);
router.get('/profile', auth, userCtrl.getProfile);
router.get('/profile-update', auth, userCtrl.getProfile);
router.put('/profile-update/:id', auth, upload.single('image'), userCtrl.updateProfile);
router.delete('/profile-delete/:id', auth, userCtrl.deleteProfile);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
