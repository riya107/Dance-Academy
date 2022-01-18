require("dotenv").config();
const express=require("express");
const cookieParser=require("cookie-parser");
const danceRouter=require("./src/routers/routs");
const path=require("path");

require("./src/db/connection");

const staticPath=path.join(__dirname,"./static");

const views=path.join(__dirname,"./views");


const app=express();
app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use(danceRouter);

app.set("view engine","pug");

app.set("views",views);

app.use(express.static(staticPath));

app.listen(process.env.PORT);
