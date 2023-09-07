const express = require('express');

const productController = require('../controllers/productController.js');
const uploadsController = require('../controllers/uploadsController.js');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router.post('/uploads', uploadsController.uploadProductImage);

module.exports = router;
