const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync"); ////Async Error hanadling function
const campgrounds=require('../controllers/campground');//controller functions
const Campground = require("../models/campground"); //Model import from models folder
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware');//isLoggedIn middleware
const multer = require("multer");//image/other file encoder
const {storage}=require('../cloudinary/')//for cloudnary storage;
const upload = multer({ storage });//path to cloudinary folder

//All campgrounds & new campground data
router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn,validateCampground,upload.array('image'),catchAsync(campgrounds.createCampground))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))//cloudinary gives link of images after they are uploded 
    // .post(upload.array('image'),(req,res)=>{
    //     console.log(req.files,req.body)
    //     res.send(req.files)

    // })



//for new campround creation form page
router.get("/new",isLoggedIn,campgrounds.renderNewForm);


//update form
router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

//update , show page & delete route
router.route('/:id')
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
    .get(catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

module.exports = router;
