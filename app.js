const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
require('dotenv').config();

// error handler
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.get('/', (req, res) => {
  res.send('File Upload Practice');
});



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
