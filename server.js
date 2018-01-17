const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');
const passport = require('passport');

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

app.use(express.static(__dirname + '/public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true })); // read utf-8 encoded
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/main')(app);

app.listen(secret.port, (err) => {
  if(err) {
    console.log(err);
  }
  else {
    console.log(`Server started at port ${secret.port}`);
  }
});
