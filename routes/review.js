const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/CatchAsync"); ////Async Error hanadling function
const ExpressError = require("../utils/ExpressError"); //Custom Error handaling class
const Campground = require("../models/campground"); //Model import from models folder
const { campgroundSchema, reviewSchema } = require("../schemas"); //Using serever side Schema
const Review = require("../models/review"); //Review Model

//for server side validation of review form
const validateReview = (req, res, next) => {
  // console.log(req)
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((element) => element.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

//Review model form route
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const review = new Review(req.body.review);
    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','New review created sucessfully');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review deleted sucessfully');
    res.redirect(`/campgrounds/${id}`);
    // res.send('At correct route');
  })
);

module.exports = router;
