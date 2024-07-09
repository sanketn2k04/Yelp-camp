const Campground = require("../models/campground"); //Model import from models folder
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware')//isLoggedIn middleware

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm=(req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground=async (req, res,next) => {
    const campground = new Campground(req.body.campground);
    campground.images=req.files.map(f=>({url:f.path,filename:f.filename}));//taking image url back from cloudinary
    campground.author=req.user._id;
    await campground.save();
    // console.log(campground._id);
    req.flash('success','New campground created sucessfully');
    res.redirect(`/campgrounds/${campground._id}`);
    // console.log(req.body);
};

module.exports.renderEditForm=async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    // console.log(campground.title);
    if(!campground)
      {
        req.flash('error','Campground not found!')
        return res.redirect(`/campgrounds`);
      }
    res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground=async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
  campground.images.push(...imgs);
  // console.log(campground);
  await campground.save();
  req.flash('success','Campground updated sucessfully');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground=async (req, res) => {
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
  // console.log(campground);
  res.render("campgrounds/show", { campground });
};

module.exports.deleteCampground=async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash('success','Campground deleted sucessfully');
  res.redirect(`/campgrounds`);
};