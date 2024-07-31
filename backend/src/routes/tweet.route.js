import { Router } from "express";
import { createTweet, editTweet, getAllTweetOfUser, removeTweet } from "../controllers/tweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isloggedIn } from "../middlewares/auth.middleware.js";

const tweetRoute=Router();

tweetRoute.get("/all-tweets-user",getAllTweetOfUser)
tweetRoute.put("/update",isloggedIn,upload.fields([{name:"imageFile",maxCount:1}]),editTweet);
tweetRoute.delete("/remove",isloggedIn,removeTweet);

tweetRoute.post("/create",isloggedIn,upload.fields([{name:"imageFile",maxCount:1}]),createTweet);

export default tweetRoute;

