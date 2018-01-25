const async = require('async');

const User = require('../models/user');
const Course = require('../models/course');

module.exports = (app) => {
  // parent route
  app.route('/become-an-instructor')
    // render page
    .get((req, res, next) => {
      res.render('teacher/become-instructor');
    })

    // create new course
    .post((req, res, next) => {
      async.waterfall([
        (callback) => {
          let course = new Course();
          course.title = req.body.title;
          course.save((err) => {
            callback(err, course);
          });
        },

        (course, callback) => {
          User.findOne({ _id: req.user._id }, (err, foundUser) => {
            foundUser.role = 'teacher';
            foundUser.coursesTeach.push({ course: course._id });
            foundUser.save((err) => {
              if(err) return next(err);
              res.redirect('/teacher/dashboard');
            });
          })
        }
      ])
    });

    app.get('/teacher/dashboard', (req, res, next) => {
      User.findOne({ _id: req.user.id })
        .populate('coursesTeach.course') // get/populate data for the coursesTeach.course objects
        .exec((err, foundUser) => { // pass callback
          res.render('teacher/teacher-dashboard', { foundUser })
        })
    });
};
