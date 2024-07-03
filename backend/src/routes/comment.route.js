import { Router } from "express";
import { createComment, editComment, getAllCommentOfTweet, getAllCommentOfVideo, removeComment } from "../controllers/comment.controller";

const route=Router();

route.get("/create",createComment);
route.delete("/remove",removeComment);
route.put("/update",editComment);

route.get("/allCommentsOfVideo",getAllCommentOfVideo);
route.get("/allCommentsOfTweet",getAllCommentOfTweet);

export default route;
