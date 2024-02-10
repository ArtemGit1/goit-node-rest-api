const mongoose = require('mongoose');
const gravatar = require('gravatar');


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  avatarURL: String,

  token: String
});

userSchema.pre('save', function(next) {
  if (!this.avatarURL) {
    this.avatarURL = gravatar.url(this.email, { s: '200', d: 'retro' }, true);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
