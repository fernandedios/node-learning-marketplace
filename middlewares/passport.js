const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const axios = require('axios');

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

// passport config for facebook strategy
passport.use(new FacebookStrategy(facebook, async (req, token, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ facebook: profile.id });

    if (user) {
      req.flash('loginMessage', 'Successfully logged in with Facebook'); // send message to ejs
      return done(null, user);
    }
    else {
      // get user details
      const newUser = new User();
      newUser.email = profile._json.email;
      newUser.facebook = profile.id;
      newUser.tokens.push({ kind: 'facebook', token });
      newUser.profile.name = profile.displayName;
      newUser.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;

      try {
        await newUser.save();
        await axios.post('https://us17.api.mailchimp.com/3.0/lists/2cc6af2c3b/members',
          {
            email_address: newUser.email,
            status: 'subscribed',

            headers: {
              'Authorization': 'randomUser 4b646e1d71f19f745f5fbf99cf803d0a-us17',
              'Content-Type': 'application/json'
            }
          });

        return done(null, newUser);
      }
      catch (err) {
        return done(err, newUser);
      }
    }
  }
  catch (err) {
    return done(err);
  }
}));
