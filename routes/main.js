const Course = require('../models/course');
const User = require('../models/user');

module.exports = (app) => {
  app.get('/', (req, res, next) => {
      Course.find({})
        .sort({ _id: -1 })
        .limit(3)
        .exec((err, courses) => {
          if (err) return next(err);

          res.render('main/home', { courses });
        });
  });

  app.get('/courses', (req, res, next) => {
    Course.find({}, (err, courses) => {
      res.render('courses/courses', { courses });
    });
  });

  app.get('/courses/:id', async (req, res, next) => {
      try {
        const course = await Course.findOne({ _id: req.params.id })
          .populate('ownByStudent.user')
          .populate('ownByTeacher')
          .exec();

        // check if user is logged in
        if (req.user) {
          // see if user has already taken the course
          const userCourse = await User.findOne({ _id: req.user.id, 'coursesTaken.course': req.params.id })
            // fetch details of course
            .populate('coursesTeach.course')
            .exec();

          // see if user made the course
          const teacherCourse = await User.findOne({ _id: req.user.id, 'coursesTeach.course': req.params.id })
            // fetch details of course
            .populate('coursesTeach.course')
            .exec();

          // user is not taking course, and is not the teacher
          if (userCourse === null && teacherCourse === null) {
            res.render('courses/courses-desc', { course, user: req.user });
          }

          // user is the teacher of the course
          else if (userCourse === null && teacherCourse !== null) {
            res.render('courses/course', { course });
          }

          // user is taking the course
          else {
            res.render('courses/course', { course });
          }
        }
        else {
          // show course details for users NOT logged in
          res.render('courses/courses-desc', { course });
        }
      }
      catch (err) {
        return next(err);
      }
  });
};
