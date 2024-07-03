const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync"); ////Async Error hanadling function

const Campground = require("../models/campground"); //Model import from models folder
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware')//isLoggedIn middleware


//All campgrounds
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
//for new campround creation form page
router.get("/new",isLoggedIn,(req, res) => {
  res.render("campgrounds/new");
});

//new campground data
router.post(
  "/",
  validateCampground,
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author=req.user._id;
    await campground.save();
    // console.log(campground._id);
    req.flash('success','New campground created sucessfully');
    res.redirect(`/campgrounds/${campground._id}`);
    // console.log(req.body);
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
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
  isLoggedIn,
  isAuthor,
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
      {
        path:'reviews',
        populate:{
          path:'author'//author of each review
        }
      }
    ).populate('author');//author of campground
    // console.log(campground);
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
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Campground deleted sucessfully');
    res.redirect(`/campgrounds`);
  })
);
module.exports = router;
