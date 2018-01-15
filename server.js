const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const secret = require('./config/secret');

mongoose.connect(secret.database, (err) => {
  if(err) {
    console.log(err);
  }
  else {
    console.log('Connected to DB');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true })); // read utf-8 encoded
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.send('home');
});

app.listen(secret.port, (err) => {
  if(err) {
    console.log(err);
  }
  else {
    console.log(`Server started at port ${secret.port}`);
  }
});
