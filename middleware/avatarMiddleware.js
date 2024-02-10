const multer = require('multer');
const jimp = require('jimp');
const path = require('path');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'tmp');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});


const upload = multer({ storage: storage });


const updateAvatar = async (req, res, next) => {
  try {
    const image = await jimp.read(req.file.path);
    await image.resize(250, 250).write(path.join(__dirname, '..', 'public', 'avatars', `${req.user._id}.jpg`));
    req.user.avatarURL = `/avatars/${req.user._id}.jpg`;
    await req.user.save();
    res.status(200).json({ avatarURL: req.user.avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, updateAvatar };
