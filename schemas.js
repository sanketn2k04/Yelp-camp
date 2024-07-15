const BaseJoi = require('joi');//for Server side validations
// Joi Schema for server side validations;
const sanitizeHtml = require('sanitize-html');



const extension = (joi) =>({
    type:'string',
    base:joi.string(),
    messages:{
        'string-escapeHTML':'{{#label}} must not include HTML'
    },
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean=sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                    allowedIframeHostnames: []
                });
                if(clean!==value) return helpers.error('string-escapeHTML',{value})
                return clean;
            }
        }
    }

});

const Joi=BaseJoi.extend(extension);
module.exports.campgroundSchema=Joi.object(
    {
        campground : Joi.object({
            title:Joi.string().required().escapeHTML(),
            price:Joi.number().min(0).required(),
            location:Joi.string().required().escapeHTML(),
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
            body:Joi.string().required().escapeHTML(),
        }).required(),
    }
)