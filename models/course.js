const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: String,
  desc: String,
  wistiaId: String,
  ownByTeacher: { type: Schema.Types.ObjectId, ref: 'User' },
  ownByStudent: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  totalStudents: Number
});

module.exports = mongoose.model('Course', CourseSchema);
