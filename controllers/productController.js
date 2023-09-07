const Product = require('../models/product');

exports.createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
};

exports.getAllProducts = async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ products });
};
