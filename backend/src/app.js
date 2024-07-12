import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import videoRouter from "./routes/video.route.js"
import commentRouter from "./routes/comment.route.js"
import tweetRouter from "./routes/tweet.route.js";
import likeRouter from "./routes/like.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import userRouter from "./routes/user.route.js";
import ApiError from "./utils/ApiError.js";
import jwt from "jsonwebtoken";


const app=express();


app.use(
  cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
  })
)

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/video/",videoRouter);
app.use("/api/v1/comment/",commentRouter);
app.use("/api/v1/tweet/",tweetRouter);
app.use("/api/v1/like/",likeRouter);
app.use("/api/v1/subscription/",subscriptionRouter);
app.use("/api/v1/user/",userRouter);
app.use("/api/v1/check",async (req,res)=>{
  
})
app.use("*",(req,res,next)=>{
   throw new ApiError(404,"route not found");
})


export {app};