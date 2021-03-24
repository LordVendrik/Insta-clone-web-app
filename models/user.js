const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
    Username: {
        type:String,
        require : true
    },
    Email:{
        type:String,
        require : true
    },
    Password:{
        type:String,
        require : true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/lordvendrik/image/upload/v1616398757/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM_ktnwzm.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
});


mongoose.model("User",UserSchema);