const passport = require('passport');
const passportConf = require('../middlewares/passport');

module.exports = (app) => {
  app.get('/login', (req, res, next) => {
    res.render('accounts/login');
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }));

  app.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/profile', (req, res, next) => {
    res.render('accounts/profile', { message: req.flash('loginMessage') }); //receive loginMessage
  });

};
