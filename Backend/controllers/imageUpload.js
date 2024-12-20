const imageUploadRouter = require('express').Router()
const uploadService = require('../services/imageUpload')

// imageUploadRouter.post('/', uploadService.upload.single('file'), (req, res) => {
//   if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//   }
//   res.send(req.file.path);
// });

imageUploadRouter.post('/', uploadService.upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Trả về đường dẫn đầy đủ
  const fullUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
  res.status(200).json(fullUrl);
});

module.exports = imageUploadRouter