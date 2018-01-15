const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase:true },
  
  profile: {
    name: { type: String, default: '' },
    picture: { type: String, default: '' }
  },

  coursesTeach: [{
    course: { type: Schema.Types.ObjectId, ref: 'Course' }
  }],

  coursesTaken: [{
    course: { type: Schema.Types.ObjectId, ref: 'Course' }
  }]
});

module.exports = mongoose.models('User', UserSchema);
