import { Router } from "express";
import { createTweet, editTweet, getAllTweetOfUser, removeTweet } from "../controllers/tweet.controller.js";

const tweetRoute=Router();

tweetRoute.get("/all-tweets-user",getAllTweetOfUser)
tweetRoute.put("/update",editTweet);
tweetRoute.delete("/remove",removeTweet);

tweetRoute.post("/create",createTweet);

export default tweetRoute;

