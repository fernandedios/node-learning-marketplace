const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const { facebook } = require('../config/secret');
const User = require('../models/user')

// store id to session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// retrieve id from session, find user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// middleware
passport.use(new FacebookStrategy(facebook, (req, token, refreshToken, profile, done) => {
  User.findOne({ facebook: profile.id }, (err, user) => {
    if(err) {
      return done(err);
    }

    if(user) {
      return done(null, user);
    }
    else {
      const newUser = new User();
      newUser.email = profile._json.email;
      newUser.facebook = profile.id;
      newUser.tokens.push({ kind: 'facebook', token });
      newUser.profile.name = profile.displayName;
      newUser.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;

      newUser.save((err) => {
        if(err) {
          throw err;
        }
        return done(null, newUser);
      });
    }
  });
}));
