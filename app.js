const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate = require('ejs-mate')//pakage for layouts
const Campground=require('./models/campground');//Model import from models folder 
const methodOverride = require('method-override');//for typecasting post form method into patch/put & delete
const catchAsync = require('./utils/CatchAsync');////Async Error hanadling function
const ExpressError = require('./utils/ExpressError');//Custom Error handaling class


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
app.post('/campgrounds',catchAsync(
    async(req,res)=>
    {
            // res.send(req.body.campground);
            if(!req.body.campground) throw new ExpressError('Insufficint data',400)
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
app.put('/campgrounds/:id',catchAsync(async(req,res)=>{
    const {id}=req.params;
    // console.log(id);
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id',catchAsync(async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
}));
app.delete('/campgrounds/:id',catchAsync(async (req,res)=>
{
    const {id}=req.params;
    const campground=await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

app.all('*',(req,res,next)=>
{
    next(new ExpressError('Route not found',400));
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