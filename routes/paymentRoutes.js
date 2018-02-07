const secret = require('../config/secret');
const stripe = require('stripe')(secret.stripeSecretKey);
const async = require('async');

const Course require('./models/course');
const User = require('./models/user');

module.exports = (app) => {
  app.post('/payment', (req, res, next) => {
    const stripeToken = req.body.stripeToken;
    const courseId = req.body.courseId;

    async.waterfall([
      // find course to buy
      (callback) => {
        Course.findOne({ _id: courseId }, (err, foundCourse) => {
          if(foundCourse) {
            callback(err, foundCourse);
          }
        });
      },

      // initiate stripe payment
      (callback) => {
        stripe.customers.create({
          source: stripeToken,
          email: req.user.email
        })
          // after creating customer, charge them with price of course
          .then((customer) => {
            return stripe.charges.create({
              amount: foundCourse.price,
              currency: 'usd',
              customer: customer.id
            })

            // update user and course
            .then((charge) => {
              async.parallel([
                // update course
                (callback) => {
                  Course.update({
                      _id: courseId,
                      // see if user is not the teacher
                      'ownByStudent.user': { $ne: req.user._id }
                    },
                    {
                      $push: { ownByStudent: { user: req.user._id }},
                      $inc: { totalStudents: 1}
                    }, (err, count) {
                      if (err) return next(err);
                      callback(err); // no need to pass the count
                    })
                },

                // update user
                (callback) => {
                  User.update(
                    {
                      _id: req.user._id,
                      // see if the course has not been taken
                      'coursesTaken.course': { $ne: courseId}
                    },
                    {
                      $push: { coursesTaken: { course: courseId }}
                    }, (err, count) => {
                      if (err) return next(err);
                      callback(err);
                    });
                },

                // increase revenue of teacher
                (callback) => {
                  User.update(
                    { _id: foundCourse.ownByTeacher },
                    {
                      $push: { revenue: { money: foundCourse.price }}
                    }, (err, count) => {
                      if (err) return next(err);
                      callback(err);
                    });
                }
              // returned objects from fn is stored in results array
              ], (err, results) => {
                if (err) return next(err);
                // redirect to course landing
                res.redirect(`/courses/${courseId}`);
              });
            });
          });
      }
    ]);
  });
};
