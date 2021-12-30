const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer-config');

const userCtrl = require('../controllers/user');

router.get('/', auth, userCtrl.home);
router.get('/:id', auth, userCtrl.getProfile);
router.put('/:id', auth, upload.single('image'), userCtrl.updateProfile);
router.delete('/:id', auth, userCtrl.deleteProfile);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
