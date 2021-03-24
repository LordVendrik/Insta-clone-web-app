const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {MongoURI} = require("./config/Keys.js");

mongoose.connect(MongoURI,{useUnifiedTopology:true,useNewUrlParser:true});
mongoose.connection.on("connected",()=>console.log("connected to mongo yeahhhhhhh!!!!!!!!!!!!!"))
mongoose.connection.on("error",(err)=>console.log(err))

require("./models/user");
require("./models/post");

app.use(express.json());

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"))
    const path = require("path");
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })
}


app.listen(process.env.PORT || 5000,()=>{
    console.log("Server Started at 5000");
})