const Campground = require("../models/campground"); //Model import from models folder
const Review = require("../models/review"); //Review Model


module.exports.createReview=async (req, res) => {
    const review = new Review(req.body.review);
    review.author=req.user._id;
    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','New review created sucessfully');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review deleted sucessfully');
    res.redirect(`/campgrounds/${id}`);
    // res.send('At correct route');
}