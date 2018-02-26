node-learning-marketplace
=========

> NodeJs Express, Wistia, Stripe, Mailchimp, Facebook Authentication

A e-learning marketplace built with NodeJs Express

Getting Started
------------

Checkout this repo, install dependencies, configure, then start the app.

```bash
$ git clone git@github.com:fernandedios/node-learning-marketplace.git
$ cd node-learning-marketplace
$ npm install

-- configure app

$ npm start
```

Configuration
------------

This web application requires the following as starting point:
- [Facebook Application]
- [Wistia Account]
- [Stripe Account]
- [Mailchimp Account]

### Local Development Variables
```js
module.exports = {
  database: 'mongodb://your_mongodb_url',
  port: process.env.PORT || 3000,
  secretKey: 'you_session_key',
  mailchimpKey: 'your_mailchimp_api_key',
  stripeSecretKey: 'your_stripe_secret_key',
  facebook: {
    clientID: 'your_facebook_client_id',
    clientSecret: 'your_facebook_secret_key',
    profileFields: ['emails', 'displayName'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true // enable passing of req object to callbacks
  }
};
```

Save as 'dev.js' and place it inside the config folder. 

### Production Environment Variables
You will need to add the following environment variables to your production host

```js
MONGO_URL,
SECRET_KEY,
MAILCHIMP_KEY,
STRIPE_SECRETKEY,
FB_CLIENTID,
FB_CLIENTSECRET,
CALLBACK_URL,
```

Thanks
------

node-learning-marketplace* © 2018, Fernan de Dios. Released under the [MIT License].<br>

> [fernandedios.com](http://fernandedios.com) &nbsp;&middot;&nbsp;
> GitHub [@fernandedios](https://github.com/fernandedios) &nbsp;&middot;&nbsp;
> Twitter [@fernan_de_dios](https://twitter.com/fernan_de_dios)

[MIT License]: http://mit-license.org/
[Facebook Application]: http://developers.facebook.com/
[Mailchimp Account]: http://mailchimp.com/
[Stripe Account]: https://stripe.com/
[Wistia Account]: https://wistia.com/
