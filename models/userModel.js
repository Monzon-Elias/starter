const mongoose = require('mongoose');
const validator = require('validator');

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
  },
  passwordConfirm: {
    type: String,
    required: [true, 'An user must confirm his/her password'],
    unique: true,
    maxlength: [
      20,
      'An user password must have less or equal than 20 characters',
    ],
    minlength: [
      4,
      'An user password must have more or equal than 3 characters',
    ],
  },
});
/*Model*/
const User = mongoose.model('User', userSchema);
module.exports = User;
