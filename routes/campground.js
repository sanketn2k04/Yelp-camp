const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync"); ////Async Error hanadling function
const campgrounds=require('../controllers/campground');//controller functions
const Campground = require("../models/campground"); //Model import from models folder
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware')//isLoggedIn middleware


//All campgrounds
router.get("/", catchAsync(campgrounds.index));

//for new campround creation form page
router.get("/new",isLoggedIn,campgrounds.renderNewForm);

//new campground data
router.post("/",validateCampground,isLoggedIn,catchAsync(campgrounds.createCampground));

//update form
router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

//update
router.put("/:id",validateCampground,isLoggedIn,isAuthor,catchAsync(campgrounds.updateCampground));

//show page
router.get("/:id",catchAsync(campgrounds.showCampground));

//delete route
router.delete("/:id",isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground));

module.exports = router;
