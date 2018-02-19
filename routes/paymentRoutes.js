const secret = require('../config/secret');
const stripe = require('stripe')(secret.stripeSecretKey);

const Course = require('../models/course');
const User = require('../models/user');

module.exports = (app) => {
  app.post('/payment', async (req, res, next) => {
    const stripeToken = req.body.stripeToken;
    const courseId = req.body.courseId;

    try {
      const foundCourse = await Course.findOne({ _id: courseId });
      const customer = await stripe.customers.create({
        source: stripeToken,
        email: req.user.email });

      const charge = await stripe.charges.create({
        amount: foundCourse.price,
        currency: 'usd',
        customer: customer.id
      });

      // update course
      await Course.update({
          _id: courseId,
          // see if user is not the teacher
          'ownByStudent.user': { $ne: req.user._id }
        },
        {
          $push: { ownByStudent: { user: req.user._id }},
          $inc: { totalStudents: 1 }
        });

      // update user
      await User.update({
          _id: req.user._id,
          // see if the course has not been taken
          'coursesTaken.course': { $ne: courseId}
        },
        { $push: { coursesTaken: { course: courseId }} });

      // increase revenue of teacher
      User.update({ _id: foundCourse.ownByTeacher },
        { $push: { revenue: { money: foundCourse.price }}});

      // redirect to course page
      res.redirect(`/courses/${courseId}`);
    }
    catch (err) {
      return next(err);
    }
  });
};
