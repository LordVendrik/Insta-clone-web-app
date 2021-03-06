const { JWT_SECRET } = require("../config/Keys");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");


module.exports = (req,res,next)=>{
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).json({error:"Must login before use"});
    }
    const token = authorization.replace("Bearer ","");
    
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
           return res.status(401).json({error:"Must login before use"});
        }

        const {_id} = payload;

        User.findById(_id).then(userData=>{
            req.user = userData;
            next();
        })
    });
}