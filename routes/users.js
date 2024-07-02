const express = require("express");
const router = express.Router();
const User=require('../models/user')//Importing user model
const catchAsync = require("../utils/CatchAsync"); ////Async Error hanadling function
const passport=require('passport');

router.get('/register',(req,res)=>
{
    res.render('users/register');
})

router.post('/register',catchAsync(
    async (req,res)=>{
        try
        {
            const {email,username,password}=req.body;
            const user=new User({username,email});
            const registeredUser=await User.register(user,password);
            req.flash('success','Welcome to Yelp-camp');
            res.redirect('/campgrounds')
        }
        catch(e)
        {
            req.flash('error',e.message);
            res.redirect('/register')
        }
    }
));

router.get('/login',(req,res)=>{
    res.render('users/login');
});
/*
Passport gives us a middleware we can use called passport.authenticate(),
we can just throw right in there just like any other middleware. 
And it's going to expect us to specify the strategy {local} but we gonna have multiple, so we could set
up a route to authenticate local and then a different route to authenticate Google or Twitter.
So after that, we have some options,we can specify in an object and I'm gonna do failure flash is 
one of them, which is true.It's just gonna flash a message for us automatically.And then we'll also 
set failure redirect if things go wrong.Redirect, I want you to redirect to slash login again. 
*/
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome back!');
    res.redirect('/campgrounds');
})

router.get('/logout',(req,res)=>
{
    req.logout(function(err){
        if (err) {
        return next(err);
        }
        req.flash('success','logged out succesfully');
        res.redirect('/campgrounds');
    });
});

module.exports=router;