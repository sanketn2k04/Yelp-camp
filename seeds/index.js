const mongoose=require('mongoose');
const Campground=require('../models/campground');//Model import from models folder 
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');

//Db connection
const dburl='mongodb://localhost:27017/yelp-camp';//url shortForm
const db=mongoose.connection; // Shorthand for mongoose.connection

mongoose.connect(dburl);


//Connection establishment Verification
db.on("error", console.error.bind(console, "connection error:"));
db.once('open',()=>{console.log("Database Connected")});


const sample=(array)=>array[Math.floor(Math.random()*array.length)];

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++)
    {
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({ 
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            author:'6684b124a7d65ac7f8f6b42e',
            images:[
                {
                  url: 'https://res.cloudinary.com/dlnkuxqcp/image/upload/v1720507647/Yelp-camp/m9mh7ux4jsj3hmkotxfv.jpg',
                  filename: 'Yelp-camp/m9mh7ux4jsj3hmkotxfv',
                },
                {
                  url: 'https://res.cloudinary.com/dlnkuxqcp/image/upload/v1720507647/Yelp-camp/xcq94iizjug8ckah2sfh.jpg',
                  filename: 'Yelp-camp/xcq94iizjug8ckah2sfh',
                }
            ],
            description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error similique veniam provident molestiae, quasi praesentium illo labore porro aut, perspiciatis qui, eaque magni non voluptas ab sunt nam? Mollitia, debitis.",
            price
        });
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})