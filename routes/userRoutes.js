const passport = require('passport');
const passportConf = require('../middlewares/passport');
const requireLogin = require('../middlewares/requireLogin');

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

  app.route('/profile/edit')
    .get(requireLogin, (req, res, next) => {
      res.render('accounts/profile-edit', { user: req.user });
    })
    .post(requireLogin, async (req, res, next) => {
      try {
        const foundUser = await User.findOne({ _id: req.user.id });

        if (req.body.name) foundUser.profile.name = req.body.name;
        if (req.body.title) foundUser.profile.title = req.body.title;
        if (req.body.picture) foundUser.profile.picture = req.body.picture;
        if (req.body.desc) foundUser.profile.desc = req.body.desc;

        await foundCourse.save();
      }
      catch (err) {
        return next(err);
      }
    });
};
