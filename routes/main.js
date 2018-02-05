const async = require('async');

const Course = require('../models/course');
const User = require('../models/user');

module.exports = (app) => {
  app.get('/', (req, res, next) => {
    res.render('main/home');
  });

  app.get('/courses', (req, res, next) => {
    Course.find({}, (err, courses) => {
      res.render('courses/courses', { courses });
    });
  });

  app.get('/courses/:id', (req, res, next) => {
    async.parallel([
      (callback) => {
        Course.findOne({ _id: req.params.id })
          .populate('ownByStudent.user')
          .exec((err, foundCourse) => {
            callback(err, foundCourse);
          });
      },

      (callback) => {
        // see if user has already taken the course
        User.findOne({ _id: req.user.id, 'coursesTaken.course': req.params.id })
          // fetch details of course
          .populate('coursesTaken.course')
          .exec((err, foundUserCourse) => {
            callback(err, foundUserCourse);
          });
      },

      (callback) => {
        // see if user made the course
        User.findOne({ _id: req.user.id, 'coursesTeach.course': req.params.id })
          // fetch details of course
          .populate('coursesTeach.course')
          .exec((err, foundUserCourse) => {
            callback(err, foundUserCourse);
          });
      }

    ], (err, results) => {
      // from first fn
      const course = results[0];

      // from 2nd fn
      const userCourse = results[1];

      // from 3rd fn
      const teacherCourse = results[2];

      // user is not taking course, and is not the teacher
      if (userCourse === null && teacherCourse === null) {
        res.render('courses/courseDesc', { course });
      }

      // user is the teacher of the course
      else if (userCourse === null && teacherCourse !== null) {
        res.render('courses/course', { course });
      }

      // user is taking the course
      else {
        res.render('courses/course', { course });
      }

    });
  });
};
