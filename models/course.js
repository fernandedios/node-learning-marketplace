const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: String,
  desc: String,
  requirements: String,
  thumbnail: String,
  wistiaId: String,
  price: Number,
  videoLength: Number,
  language: String,
  ownByTeacher: { type: Schema.Types.ObjectId, ref: 'User' },
  ownByStudent: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  totalStudents: Number
});

module.exports = mongoose.model('Course', CourseSchema);
