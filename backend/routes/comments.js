const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const commentsCtrl = require('../controllers/comments');

router.get('/', auth, commentsCtrl.getAllComments);
router.post('/', auth, commentsCtrl.postNewComment);
router.put('/:id', auth, commentsCtrl.updateComment);
router.delete('/:id', auth, commentsCtrl.deleteComment);

module.exports = router;
