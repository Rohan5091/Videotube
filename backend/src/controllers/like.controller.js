import Like from "../moddels/like.model.js";
import User from "../moddels/user.model.js";
import Video from "../moddels/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const likeOnVideo=asyncHandler(async(req,res)=>{
   const userId=req.user.id
   if (!userId) {
     return ApiError(404,"user not found");
   }
   const user=await User.findById(userId);
   if (!user) {
     return ApiError(404,"user not found");
   }

   const {videoId}=req.body;

   const video =await Video.findById(videoId);

   if (!video) {
    return ApiError(404,"video not found");
  }

  const videoIdOnLike=await Like.find({video:videoId});

  if (!videoIdOnLike) {
     const likedBy=[];
     likedBy.push(userId)
     const like=new Like({video:videoId,likedBy})
  }else{
     
    const findUser=videoIdOnLike.likedBy.find((val)=>val===userId);
    if (findUser) {
       res.json(new ApiResponse(202,null,"you liked successfully"))
    }else{
      videoIdOnLike.likedBy.push(userId);
      res.json(new ApiResponse(202,null,"you liked successfully"))
    }
  }
});

const likeOnTweet=asyncHandler(async(req,res)=>{
   const userId=req.user.id
   if (!userId) {
     return ApiError(404,"user not found");
   }
   const user=await User.findById(userId);
   if (!user) {
     return ApiError(404,"user not found");
   }

   const {tweetId}=req.body;

   const tweet =await Tweet.findById(tweetId);

   if (!tweet) {
    return ApiError(404,"tweet not found");
  }

  const tweetIdOnLike=await Like.find({tweet:tweetId});

  if (!tweetIdOnLike) {
     const likedBy=[];
     likedBy.push(userId)
     const like=new Like({tweet:tweetId,likedBy})
     await like.save()
     res.json(new ApiResponse(202,null,"you liked successfully"))
  }else{
     
    const findUser=tweetIdOnLike.likedBy.find((val)=>val===userId);
    if (findUser) {
       res.json(new ApiResponse(202,null,"you liked successfully"))
    }else{
      tweetIdOnLike.likedBy.push(userId);
      await tweetIdOnLike.save();
      res.json(new ApiResponse(202,null,"you liked successfully"))
    }
  }
});

const likeOnComment=asyncHandler(async(req,res)=>{
   const userId=req.user.id
   if (!userId) {
     return ApiError(404,"user not found");
   }
   const user=await User.findById(userId);
   if (!user) {
     return ApiError(404,"user not found");
   }

   const {commentId}=req.body;

   const comment =await Comment.findById(commentId);

   if (!comment) {
    return ApiError(404,"comment not found");
  }

  const commentIdOnLike=await Like.find({comment:commentId});

  if (!commentIdOnLike) {
     const likedBy=[];
     likedBy.push(userId)
     const like=new Like({comment:commentId,likedBy})
  }else{
     
    const findUser=commentIdOnLike.likedBy.find((val)=>val===userId);
    if (findUser) {
       res.json(new ApiResponse(202,null,"you liked successfully"))
    }else{
      commentIdOnLike.likedBy.push(userId);
      res.json(new ApiResponse(202,null,"you liked successfully"))
    }
  }
});

export {likeOnVideo,likeOnTweet,likeOnComment};