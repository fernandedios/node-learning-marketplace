module.exports = {
  database: process.env.MONGO_URL,
  port: process.env.PORT,
  secretKey: process.env.SECRET_KEY, // session
  mailchimpKey: process.env.MAILCHIMP_KEY,
  stripeSecretKey: process.env.STRIPE_SECRETKEY,
  facebook: {
    clientID: process.env.FB_CLIENTID,
    clientSecret: process.env.FB_CLIENTSECRET,
    profileFields: ['emails', 'displayName'],
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true // enable passing of req object to callbacks
  }
};
