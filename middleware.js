const ExpressError = require("./utils/ExpressError"); //Custom Error handaling class
const Campground = require("./models/campground"); //Model import from models folder
const { campgroundSchema, reviewSchema } = require("./schemas"); //Using serever side Schema
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must signed in");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

//for server side validation of new/edit campground form
module.exports.validateCampground = (req, res, next) => {
  // console.log(req.body)
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((element) => element.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};
//to verify Author
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  // console.log(id);
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You have not permission to do so!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You have not permission to do so!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

//for server side validation of review form
module.exports.validateReview = (req, res, next) => {
  // console.log(req)
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((element) => element.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};
