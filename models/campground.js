const mongoose=require('mongoose');
const Review = require('./review');

const Schema=mongoose.Schema;
//I can only add virtual properties to a schema so new ImageSchema to apply to each indivial image
const imageSchema=mongoose.Schema(
    {
        url:String,
        filename:String,
    }
);
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload/','/upload/w_200/');
    // virtual keyword is used to define a virtual property on a schema. A virtual property is not stored 
    // in the database but is computed on the fly based on other properties of the document.
});

const opts={toJSON:{virtuals:true}}

const campgroundSchema=new Schema({
    title:String,
    price:Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images:[imageSchema],
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review',
        }
    ]
},opts);

campgroundSchema.virtual('properties.popUpMarkUp').get(function(){
    return `<strong>
                <a href="/campgrounds/${this._id}">${this.title}</a>
            </strong>
            <p>${this.description.substring(0,20)}...</p>`;
    // virtual keyword is used to define a virtual property on a schema. A virtual property is not stored 
    // in the database but is computed on the fly based on other properties of the document.
});

campgroundSchema.post('findOneAndDelete',async function(doc)
{
    if(doc)
    {
        await Review.deleteMany(
            {
                _id:{
                    $in:doc.reviews
                }
            }
        )
    }    
});
module.exports=mongoose.model('Campground',campgroundSchema);