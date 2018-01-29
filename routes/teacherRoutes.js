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
          res.render('teacher/teacher-dashboard', { foundUser });
        });
    });

    // parent route
    app.route('/create-course')
      // render page
      .get((req, res, next) => {
        res.render('teacher/create-course');
      })

      // create new course
      .post((req, res, next) => {
        async.waterfall([
          (callback) => {
            let course = new Course();
            course.title = req.body.title;
            course.price = req.body.price;
            course.desc = req.body.desc;
            course.wistiaId = req.body.wistiaId;
            course.ownByTeacher = req.user._id;
            course.save((err) => {
              callback(err, course);
            });
          },

          (course, callback) => {
            User.findOne({ _id: req.user._id }, (err, foundUser) => {
              foundUser.coursesTeach.push({ course: course._id });
              foundUser.save((err) => {
                if(err) return next(err);
                res.redirect('/teacher/dashboard');
              });
            })
          }
        ])
      });

    app.route('/edit-course')
      .get((req, res, next) => {
        Course.findOne({ _id: req.params.id }, (err, foundCourse) => {
          res.render('teacher/edit-course', { course: foundCourse });
        });
      });

      .post((req, res, next) => {
        Course.findOne({ _id: req.params.id }, (err, foundCourse) => {
          if (foundCourse) {
            if (req.body.title) foundCourse.title = req.body.title;
            if (req.body.wistiaId) foundCourse.wistiaId = req.body.wistiaId;
            if (req.body.price) foundCourse.price = req.body.price;
            if (req.body.desc) foundCourse.desc = req.body.desc;

            foundCourse.save((err) => {
              if (err) return next(err);
              res.redirect('/teacher/dashboard');
            });
          }
        });
      });
};
