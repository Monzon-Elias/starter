const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId, // --this is where the reference happens
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to an user'],
    },
  },

  /*Schema Options Object */
  //their purpuse is to make visible in the output
  //whenever a virtual field is present (one that is not stored in the db, like a calculation...)
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
/*Model*/
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
