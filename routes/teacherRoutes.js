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
    .post(async (req, res, next) => {
      let course = new Course();
      course.title = req.body.title;

      try {
        await course.save();
        const foundUser = await User.findOne({ _id: req.user._id });

        foundUser.role = 'teacher';
        foundUser.coursesTeach.push({ course: course._id });
        await foundUser.save();

        res.redirect('/teacher/dashboard');
      }
      catch (err) {
        return next(err);
      }
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
      .post(async (req, res, next) => {
        let course = new Course();
        course.title = req.body.title;
        course.price = req.body.price;
        course.desc = req.body.desc;
        course.wistiaId = req.body.wistiaId;
        course.ownByTeacher = req.user._id;

        try {
          await course.save();
          const foundUser = await User.findOne({ _id: req.user._id });
          foundUser.coursesTeach.push({ course: course._id });
          await foundUser.save();

          res.redirect('/teacher/dashboard');
        }
        catch (err) {
          return next(err);
        }
      });

    app.route('/edit-course/:id')
      .get((req, res, next) => {
        Course.findOne({ _id: req.params.id }, (err, foundCourse) => {
          res.render('teacher/edit-course', { course: foundCourse });
        });
      })

      .post((req, res, next) => {
        Course.findOne({ _id: req.params.id }, (err, foundCourse) => {
          if (foundCourse) {
            // update only if value is found
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

    app.get('/revenue-report', (req, res, next) => {
      let revenue = 0;
      User.findOne({ _id: req.user._id }, (err, foundUser) => {
        foundUser.revenue.forEach((value) => {
          revenue += parseInt(value.money) / 100;
        });

        res.render('teacher/revenue-report', { revenue });
      });
    });
};
