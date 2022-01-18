const mongoose=require("mongoose");

mongoose.connect(process.env.mongo_add,{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false,useUnifiedTopology:true}).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});