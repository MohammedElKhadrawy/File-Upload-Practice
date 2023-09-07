const path = require('path');

const { v4: uuidv4 } = require('uuid');

const throwCustomError = require('../errors/custom-error');

exports.uploadProductImage = async (req, res, next) => {
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
