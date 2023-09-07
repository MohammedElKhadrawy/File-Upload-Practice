const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
require('express-async-errors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/uploads', // Virtual path prefix!
  express.static(path.join(__dirname, 'uploads'))
);

app.use(express.json());
app.use(fileUpload());

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
