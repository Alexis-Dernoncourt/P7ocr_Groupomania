const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};


const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, `images/`);
  },
  filename: (_, file, callback) => {
    const name = file.originalname.split(' ').join('_').split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateNow = new Date().toLocaleDateString('fr-FR', options).split(' ').join('_');
    callback(null, name + Date.now() + '_' + dateNow + '.' + extension);
  }
});

const fileFilter = (_, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    callback(null, true)
  } else {
    callback(new Error("L'image n'est pas acceptée"), false);
  }
}

module.exports = multer({storage, limits: {fileSize: 1000*1000*8}, fileFilter});
