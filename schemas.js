const Joi = require('joi');//for Server side validations
// Joi Schema for server side validations;
module.exports.campgroundSchema=Joi.object(
    {
        campground : Joi.object({
            title:Joi.string().required(),
            price:Joi.number().min(0).required(),
            location:Joi.string().required(),
            description:Joi.required(),
            image:Joi.string().required()
        }).required()
    }
)