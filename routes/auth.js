const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/Keys");
const requirelogin = require("../middleware/requirelogin");


router.post("/signup",(req,res)=>{
    const {Username,Email,Password,pic} = req.body;

    if(!Email||!Password||!Username){
       return res.status(422).json({error:"Please fill all fields"});
    }

    User.findOne({Email:Email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User Already Exist with that email"});
        }

        bcrypt.hash(Password,12)
        .then(hashedpassword=>{
                    
            const user = new User({
                Username:Username,
                Email:Email,
                Password:hashedpassword,
                pic:pic
            });

            user.save()
            .then(user=>{
                res.json({message:"User Saved"});
            })
            .catch(err=>{
                console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
        })

});


router.post("/signin",(req,res)=>{
    const{Email,Password} = req.body;

    if(!Email|| !Password){
        return res.status(422).json({error:"Server cannot process the request"});
    }

    User.findOne({Email:Email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"No User"});
        }

        bcrypt.compare(Password,savedUser.Password)
        .then(ismatched=>{
            if(ismatched){
                // res.json({message:"successfully Logged in"});
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET);
                const {_id,Username,Email,followers,following,pic} = savedUser;
                res.json({token,user:{_id,Username,Email,followers,following,pic}});
            }else{
                res.status(422).json({error:"Wrong Username or Password"});
            }
        })
        .catch(err=>{return res.json({error:err})})
    })
});

module.exports = router;