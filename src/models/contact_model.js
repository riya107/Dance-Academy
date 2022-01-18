const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required field"],
        minlength:3
    },
    phone:{
        type:String,
        required:[true,"Phone number is required field"],
        unique:[true,"Phone Number Already Present"],
        validate(value){
            if(!(/^[1-9][0-9]{9}$/).test(value)){
                throw new Error("Invalid Phone Number");
            }
        }
    },
    email:{
        type: String,
        required:[true,"Email is required field"],
        unique:[true,"Email Already Present"],
        validate(value){
            if(!(validator.isEmail(value))){
                throw new Error("Invalid Email");
            }
        }
    },
    img:{
        type:String
    },
    password:{
        type:String,
        required:[true,"Password is required field"],
    }
},{versionKey:false});

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
    }
    next();
});

const User=mongoose.model("User",userSchema);

module.exports=User;




