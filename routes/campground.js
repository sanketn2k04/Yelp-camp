const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync"); ////Async Error hanadling function
const campgrounds=require('../controllers/campground');//controller functions
const Campground = require("../models/campground"); //Model import from models folder
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware')//isLoggedIn middleware



//All campgrounds & new campground data
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(validateCampground,isLoggedIn,catchAsync(campgrounds.createCampground))



//for new campround creation form page
router.get("/new",isLoggedIn,campgrounds.renderNewForm);


//update form
router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

//update , show page & delete route
router.route('/:id')
    .put(validateCampground,isLoggedIn,isAuthor,catchAsync(campgrounds.updateCampground))
    .get(catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

module.exports = router;
