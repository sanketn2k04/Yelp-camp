const express = require("express");
const router = express.Router();
const User=require('../models/user')//Importing user model
const catchAsync = require("../utils/CatchAsync"); ////Async Error hanadling function
const passport=require('passport');
const {storeReturnTo}=require('../middleware');
const users = require("../controllers/users");


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post( // use the storeReturnTo middleware to save the returnTo value from session to res.locals
        storeReturnTo,
        // passport.authenticate logs the user in and clears req.session
        passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login)

/*
Passport gives us a middleware we can use called passport.authenticate(),
we can just throw right in there just like any other middleware. 
And it's going to expect us to specify the strategy {local} but we gonna have multiple, so we could set
up a route to authenticate local and then a different route to authenticate Google or Twitter.
So after that, we have some options,we can specify in an object and I'm gonna do failure flash is 
one of them, which is true.It's just gonna flash a message for us automatically.And then we'll also 
set failure redirect if things go wrong.Redirect, I want you to redirect to slash login again. 
*/

router.get('/logout',users.logout);

module.exports=router;