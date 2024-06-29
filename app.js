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
const session = require("express-session"); //session creation and for flash
const flash = require("connect-flash"); //imports the 'connect-flash' module using the 'require' function in Node.js.

//Db connection
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

//Middle wares
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE/PATCH
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  secret: "Thissecretkeywillbeimroved",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
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





app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  // console.log(res.locals.success)
  res.locals.error=req.flash('error');
  next();
})

app.get("/", (req, res) => {
  res.render("home.ejs");
});
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
