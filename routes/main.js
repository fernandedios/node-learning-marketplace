const Course = require('../models/course');

module.exports = (app) => {
  app.get('/', (req, res, next) => {
    res.render('main/home');
  });

  app.get('/courses', (req, res, next) => {
    Course.find({}, (err, courses) => {
      res.render('courses/courses', { courses });
    });
  });
};
