const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An user must have a name'],
    unique: true,
    maxlength: [20, 'An user name must have less or equal than 20 characters'],
    minlength: [3, 'An user name must have more or equal than 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'An user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    maxlength: [40, 'An user email must have less or equal than 20 characters'],
    minlength: [10, 'An user email must have more or equal than 3 characters'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please, provide a password'],
    maxlength: [20, 'An user name must have less or equal than 20 characters'],
    minlength: [4, 'An user name must have more or equal than 3 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'An user must confirm his/her password'],
    validate: {
      //This only works on CREATE & SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same!',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  //Only run this function if password qas actually modified
  if (!this.isModified('password')) return next();
  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete passwordConfirm to not persist in the db
  this.passwordConfirm = undefined;
  next();
});
//instant method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  //False means not changed
  return false;
};

/*Model*/
const User = mongoose.model('User', userSchema);
module.exports = User;
