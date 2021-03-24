const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requirelogin = require("../middleware/requirelogin");
const post = mongoose.model("post");


router.get("/allpost",requirelogin,(req,res)=>{
    post.find()
    .populate("postedBy","_id Username")
    .populate("comments.postedBy","_id Username")
    .then(allposts=>{
        res.json({post:allposts});
    })
    .catch(err=>{
        console.log(err);
    });
})

router.get("/getsubpost",requirelogin,(req,res)=>{
    post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id Username")
    .populate("comments.postedBy","_id Username")
    .then(allposts=>{
        res.json({post:allposts});
    })
    .catch(err=>{
        console.log(err);
    });
})

router.post("/createPost",requirelogin,(req,res)=>{
    const{title,body,url} = req.body;

    console.log(title+" "+body+" "+url);

    if(!title || !body || !url){
        return res.status(422).json({error:"Please add title and/or body"});
    }

    req.user.Password = undefined;

    const posts = new post({
        title,
        body,
        photo:url,
        postedBy:req.user
    }); 

    posts.save().then(result=>{
        res.json({post:result});
    }).catch(err=>{
        console.log(err);
    });
});

router.get("/mypost",requirelogin,(req,res)=>{
    post.find({postedBy:req.user._id})
    .populate("postedBy","_id Username")
    .then(mypost=>{
        res.json({mypost});
    })
    .catch(err=>{
        console.log(err);
    })
})

router.put("/like",requirelogin,(req,res)=>{
    post.findByIdAndUpdate(req.body.postID,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })
})

router.put("/unlike",requirelogin,(req,res)=>{
    post.findByIdAndUpdate(req.body.postID,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })
})

router.put("/comment",requirelogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    post.findByIdAndUpdate(req.body.postID,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id Username")
    .populate("postedBy","_id Username")
    .exec((err,result)=>{
        if(err){
            res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })
})

router.put("/deletecomment",requirelogin,(req,res)=>{
    post.findByIdAndUpdate(req.body.postID,{
        $pull:{comments:{_id:req.body.commentID}}
    },{
        new:true
    })
    .populate("comments.postedBy","_id Username")
    .populate("postedBy","_id Username")
    .exec((err,result)=>{
        if(err){
            res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })
})

router.delete("/deletepost/:postid",requirelogin,(req,res)=>{
    post.findOne({_id:req.params.postid})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err});
        }else{
            if(post.postedBy._id.toString() === req.user._id.toString()){
                post.remove()
                .then(result=>{
                    res.json(result)
                }).catch(err=>{
                    console.log(err);
                })
            }
        }
    })
})

module.exports = router;