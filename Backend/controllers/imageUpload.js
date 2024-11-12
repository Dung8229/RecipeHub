const imageUploadRouter = require('express').Router()
const uploadService = require('../services/imageUpload')

imageUploadRouter.post('/', uploadService.upload.single('file'), (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  res.send(req.file.path);
});

module.exports = imageUploadRouter