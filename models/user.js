const mongoose=require('mongoose');
const {Schema}=mongoose;
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    }
});
//Adding username and passport directly into mongoose
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);