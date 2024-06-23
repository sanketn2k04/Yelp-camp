const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate = require('ejs-mate')//pakage for layouts
const Campground=require('./models/campground');//Model import from models folder 
const methodOverride = require('method-override');//for typecasting post form method into patch/put & delete
const catchAsync = require('./utils/CatchAsync');////Async Error hanadling function
const ExpressError = require('./utils/ExpressError');//Custom Error handaling class
const Joi = require('joi');//for Server side validations
const {campgroundSchema , reviewSchema }=require('./schemas')//Using serever side Schema
const Review=require('./models/review');//Review Model

//Db connection
const dburl='mongodb://localhost:27017/yelp-camp';//url shortForm
const db=mongoose.connection; // Shorthand for mongoose.connection

mongoose.connect(dburl);


//Connection establishment Verification
db.on("error", console.error.bind(console, "connection error:"));
db.once('open',()=>{console.log("Database Connected")});


const app=express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


//Middle wares
app.use(express.urlencoded({extended:true}));
// override with POST having ?_method=DELETE/PATCH
app.use(methodOverride('_method'))
//for server side validation of new/edit campground form
const validateCampground = (req,res,next)=>
{
    // console.log(req)
    const {error}=campgroundSchema.validate(req.body);
    if(error)
    {
        const message=error.details.map(element=>element.message).join(',')
        throw new ExpressError(message,400)
    } 
    else
    {
        next();
    }
}    
//for server side validation of review form
const validateReview= (req,res,next)=>
{
    // console.log(req)
    const {error}=reviewSchema.validate(req.body);
    if(error)
    {
        const message=error.details.map(element=>element.message).join(',')
        throw new ExpressError(message,400)
    } 
    else
    {
        next();
    }
}    

app.get('/',(req,res)=>{
    res.render('home.ejs');
});
app.get('/campgrounds',catchAsync(async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));
//for new campround creation form page
app.get('/campgrounds/new',(req,res)=>
{
    res.render('campgrounds/new');
});

//new campground data
app.post('/campgrounds',validateCampground,catchAsync(
    async(req,res)=>
    {   
            const campground=new Campground(req.body.campground);
            await campground.save();
            // console.log(campground._id);
            res.redirect(`/campgrounds/${campground._id}`);
            // console.log(req.body);
        
    }
));


app.get('/campgrounds/:id/edit',catchAsync(async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    // console.log(campground.title);
    res.render('campgrounds/edit',{campground});
}));
app.put('/campgrounds/:id',validateCampground,catchAsync(async(req,res)=>{
    const {id}=req.params;
    // console.log(id);
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id',catchAsync(async (req,res)=>{
    const campground=await Campground.findById(req.params.id).populate('reviews');
    // const campground=await Campground.findById(req.params.id);
    // console.log(campground)
    res.render('campgrounds/show',{campground});
}));
app.delete('/campgrounds/:id',catchAsync(async (req,res)=>
{
    const {id}=req.params;
    const campground=await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));
//Review model form route
app.post('/campgrounds/:id/review',validateReview,catchAsync(async(req,res)=>
    {
        const review=new Review(req.body.review);
        const campground=await Campground.findById(req.params.id);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    }
));
app.delete('/campgrounds/:id/review/:reviewId',catchAsync(async(req,res)=>
    {
        const {id,reviewId}=req.params;
        await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/campgrounds/${id}`);
        // res.send('At correct route');
    }
));
app.all('*',(req,res,next)=>
{
    next(new ExpressError('Route not found',404));
});
app.use((err,req,res,next)=>
{
    const {statusCode=500}=err;
    if(!err.message) err.message='Something went wrong!';
    res.status(statusCode).render('error',{err});
})
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});