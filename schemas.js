const Joi = require('joi');//for Server side validations
// Joi Schema for server side validations;
module.exports.campgroundSchema=Joi.object(
    {
        campground : Joi.object({
            title:Joi.string().required(),
            price:Joi.number().min(0).required(),
            location:Joi.string().required(),
            description:Joi.required(),
            // image:Joi.string().required() 
            //commented to check cloudinary images works/not
        }).required(),
        deleteImages:Joi.array(),
    }
)

module.exports.reviewSchema=Joi.object(
    {
        review:Joi.object({
            rating:Joi.number().min(1).max(5).required(),
            body:Joi.string().required(),
        }).required(),
    }
)