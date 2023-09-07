const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
const { v2: cloudinary } = require('cloudinary');

const throwCustomError = require('../errors/custom-error');

// Reference for storing images locally on the server
exports.uploadProductImageLocal = async (req, res, next) => {
  console.log(req.files);
  // check for file existence
  if (!req.files) {
    throwCustomError('Please upload a file.', 400);
  }

  const productImage = req.files.image;

  // check for file type
  if (!productImage.mimetype.startsWith('image')) {
    throwCustomError('Please upload an image.', 400);
  }

  // check for file size
  const maxSize = 1024 * 1024; // 1MB
  if (productImage.size > maxSize) {
    throwCustomError('Please upload an image smaller than 1MB', 400);
  }

  const imageName = uuidv4() + '-' + productImage.name;

  const imagePath = path.join(__dirname, `../uploads/${imageName}`);
  await productImage.mv(imagePath); // we MUST await!

  res.status(200).json({ image: { src: `uploads/${imageName}` } });
};

// Reference for storing images on the cloud (more servers around the world = faster loading and access!)
exports.uploadProductImage = async (req, res, next) => {
  const imageTempPath = req.files.image.tempFilePath;
  const result = await cloudinary.uploader.upload(imageTempPath, {
    use_filename: true,
    folder: 'file-upload',
  });
  fs.unlinkSync(imageTempPath);
  res.status(200).json({ image: { src: result.secure_url } });
};
