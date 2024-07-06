const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/CatchAsync"); ////Async Error hanadling function
const Campground = require("../models/campground"); //Model import from models folder
const Review = require("../models/review"); //Review Model
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware');
const reviews = require("../controllers/reviews");

//Review model form route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviews.createReview)
);
//Delete review model
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
