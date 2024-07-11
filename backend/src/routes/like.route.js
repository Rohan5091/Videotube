import {Router} from "express";
import { likeOnComment, likeOnTweet, likeOnVideo } from "../controllers/like.controller.js";

const likeRoute=Router();

likeRoute.post("/comment",likeOnComment);
likeRoute.post("/video",likeOnVideo);
likeRoute.post("/tweet",likeOnTweet);


export default likeRoute;
