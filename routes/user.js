const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requirelogin = require("../middleware/requirelogin");
const post = mongoose.model("post");
const User = mongoose.model("User");


router.get("/user/:id",requirelogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-Password")
    .then(user=>{
        post.find({postedBy:req.params.id})
        .populate("postedBy","_id Username")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err});
            }
         res.json({user,posts});
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"});
    });
})

router.put("/follow",requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        }).select("-Password").then(result=>{
            res.json(result);
        }).catch(err=>{
            return res.status(422).json({error:err});
        })
    });
});

router.put("/unfollow",requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        }).select("-Password").then(result=>{
            res.json(result);
        }).catch(err=>{
            return res.status(422).json({error:err});
        })
    });
});

router.put("/updatepic",requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:"pic cannot post"});
            }
            res.json(result);
    })
})


module.exports = router;