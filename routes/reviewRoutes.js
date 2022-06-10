const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); //now, things like 'POST /tour/2323/reviews' will be (*)

//Only authenticated users are able to work with reviews thanks to this middleware
router.use(authController.protect);

router
  .route('/') // (*) redirected to this route
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserId,
    reviewController.createReview
  );

//only users and admins can post or delete reviews. It's contrary to the business rules for leads to do it.
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
