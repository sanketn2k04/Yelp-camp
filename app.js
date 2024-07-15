if(process.env.NODE_ENV !== 'production')
{
  require('dotenv').config();
}  

// console.log(process.env.ClOUDINARY_CLOUD_NAME);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); //pakage for layouts
const Campground = require("./models/campground"); //Model import from models folder
const methodOverride = require("method-override"); //for typecasting post form method into patch/put & delete
const ExpressError = require("./utils/ExpressError"); //Custom Error handaling class
const Joi = require("joi"); //for Server side validations
const Review = require("./models/review"); //Review Model
const campgroundRoutes = require("./routes/campground"); //campground routes
const reviewRoutes = require("./routes/review"); //review routes
const usersRoute=require("./routes/users")//User Authentication routes
const session = require("express-session"); //session creation and for flash
const flash = require("connect-flash"); //imports the 'connect-flash' module using the 'require' function in Node.js.
const passport=require("passport");//for authentication
const localStratagy=require("passport-local");//for authentication
const User=require('./models/user');
const isLoggedIn=require('./middleware')//isLoggedin middleware
const mongoSanitize = require('express-mongo-sanitize');
const { name } = require('ejs');
const helmet=require('helmet')

const MongoStore = require('connect-mongo');//for session store


//Db connection
// const dburl=process.env.DBURL;
const dburl = "mongodb://localhost:27017/yelp-camp"; //url shortForm
const db = mongoose.connection; // Shorthand for mongoose.connection

mongoose.connect(dburl);

//Connection establishment Verification
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Middlewares
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE/PATCH
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: dburl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'thisshouldbeabettersecret!'
  }
});
store.on('error',(e)=>
{
  console.log('Session store error',e);
})

app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  store,//=store:stroe
  name:'not a default name',
  secret: "Thissecretkeywillbeimroved",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expiration after a week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
/* The code snippet is configuring and using two middleware functions 
in a JavaScript application. The session middleware is being used with 
a provided sessionConfig object, and the flash middleware is being used 
without any additional configuration.*/
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

// Use Helmet!
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  // "https://api.tiles.mapbox.com/",
  // "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  // "https://api.mapbox.com/",
  // "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
  // "https://api.mapbox.com/",
  // "https://a.tiles.mapbox.com/",
  // "https://b.tiles.mapbox.com/",
  // "https://events.mapbox.com/",
  "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          childSrc: ["blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dlnkuxqcp/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com",
              "https://api.maptiler.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);


app.use(passport.initialize());
// make sure that session is used before passport.session 
app.use(passport.session());//for persistent login sessions versus the alternative would be having to log in on every single request, which is actually something you do often with APIs but not as a user with
// To remove data using these defaults:
app.use(mongoSanitize());

passport.use(new localStratagy(User.authenticate()));//using authenticate methood of passport


/*
Serialization refers to basically,how do we store a user in the session.
And then the opposite, deserialize,how do you get a user out of that session 
---> Basically how to store it and unstore it in this session. 
*/
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  // console.log(req.session);
  res.locals.currUser=req.user;//for determining wheather the user logged in or not
  res.locals.success=req.flash('success');//for flash messages
  // console.log(res.locals.success)
  res.locals.error=req.flash('error');
  next();
})

//
app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.use("/", usersRoute); //Breaking Out User authentication Routes
app.use("/campgrounds", campgroundRoutes); //Breaking Out Campground Routes
app.use("/campgrounds/:id/review", reviewRoutes); //Breaking Out Review Routes

app.all("*", (req, res, next) => {
  next(new ExpressError("Route not found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});