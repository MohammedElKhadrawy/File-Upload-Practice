const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const { v2: cloudinary } = require('cloudinary');
require('express-async-errors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/uploads', // Virtual path prefix! cuz the folder itself is included in the path and not just the contents!
  express.static(path.join(__dirname, 'uploads'))
);

app.use(express.json());
// useTempFiles handles the temporary local file storage for us until it's uploaded to Cloudinary
// SO, yeah! we need both! to save us the hassle :D
app.use(fileUpload({ useTempFiles: true }));

app.get('/', (req, res) => {
  res.send('File Upload Practice');
});

app.use('/api/v1/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  })
  .catch((err) => console.log(err));
