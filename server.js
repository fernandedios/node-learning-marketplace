const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');

const app = express();
const secret = require('./config/secret');
const userMiddleware = require('./middlewares/userMiddleware');

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
app.use(cookieParser()); // read cookies from browser

// store sessions to db
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(userMiddleware); // get access to user object

// routes
require('./routes/main')(app);
require('./routes/userRoutes')(app);
require('./routes/teacherRoutes')(app);

app.listen(secret.port, (err) => {
  if(err) {
    console.log(err);
  }
  else {
    console.log(`Server started at port ${secret.port}`);
  }
});
