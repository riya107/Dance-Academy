const express=require("express");
const bcrypt=require("bcryptjs");
const User=require("../models/contact_model");
const jwt=require("jsonwebtoken");
const path = require("path");
const multer = require("multer");

const router=express.Router();

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./static/uploads");
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});

const upload=multer({storage:storage}).single("img");

router.get("/",(req,res)=>{
    res.render("home");
});

router.get("/logout",(req,res)=>{
    try{
    res.clearCookie("jwt");
    res.redirect("/");
    }
    catch(err){
        res.status(400).render("error");
    }
});

router.get("/signup",(req,res)=>{
    res.render("signup");
});

router.get("/login",(req,res)=>{
    res.render("login");
});

router.get("/myself",async (req,res)=>{
    try{
    const token = req.cookies.jwt;
    const info=await jwt.verify(token,process.env.SECRET_KEY);
    const user=await User.findById({_id:info._id});
    res.render("successful",user);
    }
    catch(err){
        res.redirect("/login");
    }
});

router.post("/login/confirm",async (req,res)=>{
    try{
    const user=req.body;
    const userData=await User.findOne({email:user.email});
    if(!(userData)){
        return res.status(400).render("error");
    }
    else{
        const match= await bcrypt.compare(user.password,userData.password);
        if(match){
            const token = await jwt.sign({_id:userData._id},process.env.SECRET_KEY,{expiresIn:2*24*60*60});
            res.cookie("jwt",token,{maxAge:2*24*60*60*1000,httpOnly:true});
            res.render("successful",userData);
        }
        else{
            res.status(400).render("error");
        }
    }
}
    catch(err){
        res.status(400).render("error");
    }
});

router.post("/signup/confirm",upload,async function(req,res){
    try{
    const user=new User({...req.body,...{img:req.file.filename}});
    let userData=await user.save();
    const token = await jwt.sign({_id:user._id},process.env.SECRET_KEY,{expiresIn:2*24*60*60});
    res.cookie("jwt",token,{maxAge:2*24*60*60*1000,httpOnly:true});
    res.status(201).render("successful",userData);
    }
    catch(err){
        res.status(400).render("error");
    }
});

module.exports=router;

