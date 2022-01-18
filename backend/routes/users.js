const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer-config');

const userCtrl = require('../controllers/user');

router.get('/:id', auth, userCtrl.getProfile);
//router.get('/', auth, userCtrl.getAllProfiles);
router.put('/:id', auth, upload.single('image'), userCtrl.updateProfile);
router.delete('/:id', auth, userCtrl.deleteProfile);

module.exports = router;
