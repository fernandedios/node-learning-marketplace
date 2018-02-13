// next is a function that will pass request to the next middleware
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login'); // kick them to login page
  }

  next();
};
