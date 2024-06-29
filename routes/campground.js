const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync"); ////Async Error hanadling function
const ExpressError = require("../utils/ExpressError"); //Custom Error handaling class
const { campgroundSchema } = require("../schemas"); //Using serever side Schema
const Campground = require("../models/campground"); //Model import from models folder

//for server side validation of new/edit campground form
const validateCampground = (req, res, next) => {
  // console.log(req)
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((element) => element.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

//All campgrounds
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
//for new campround creation form page
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

//new campground data
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    // console.log(campground._id);
    req.flash('success','New campground created sucessfully');
    res.redirect(`/campgrounds/${campground._id}`);
    // console.log(req.body);
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    // console.log(campground.title);

    if(!campground)
      {
        req.flash('error','Campground not found!')
        return res.redirect(`/campgrounds`);
      }
    res.render("campgrounds/edit", { campground });
  })
);
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success','Campground updated sucessfully');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if(!campground)
      {
        req.flash('error','Campground not found!')
        return res.redirect(`/campgrounds`);
      }
    // const campground=await Campground.findById(req.params.id);
    // console.log(campground)
    res.render("campgrounds/show", { campground });
  })
);
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Campground deleted sucessfully');
    res.redirect(`/campgrounds`);
  })
);
module.exports = router;
