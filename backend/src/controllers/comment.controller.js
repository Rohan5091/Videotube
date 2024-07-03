import Comment from "../moddels/comment.model.js";
import User from "../moddels/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const createComment=asyncHandler(async (req,res)=>{
    const userId=req.user.id;

    const user=await User.findById(userId);

    if (!user) {
      return ApiError(404,"user not found");
    }

    const {videoId,commentText,tweetId}=req.body;

    if(!commentText){
       return ApiError(401,"comment text is required");
    }
    let comment;

    if (videoId) {
       comment=new Comment({
        content:commentText,
        owner:userId,
        video:videoId,
     })
    } else if(tweetId){
      comment=new Comment({
        content:commentText,
        owner:userId,
        tweet:tweetId,
     })
    }else{
      return ApiError(404,"videoId or tweetId is required")
    }

    await comment.save();

    res.json( new ApiResponse(202,"comment is created",comment));

});

const removeComment=asyncHandler(async (req,res)=>{
  const userId=req.user.id;

  const user=await User.findById(userId);

  if (!user) {
   return ApiError(404,"user not found");
  }
  const {commentId}=req.body

  if (!commentId) {
   return ApiError(404,"commentId is not found");
  }

  await Comment.findByIdAndDelete(commentId);

  res.json(new ApiResponse(202,"comment deleted successfully"));

});

const editComment=asyncHandler(async (req,res)=>{
  const userId=req.user.id;

  const user=await User.findById(userId);

  if (!user) {
    return ApiError(404,"user not found");
  }
  const {commentId,commentText}=req.body

  if (!commentId || !commentText) {
   return ApiError(404,"commentId or commentText is required");
  }

  await Comment.findByIdAndUpdate(commentId,{content:commentText});

  res.json(new ApiResponse(202,"comment updated successfully"));

});

const getAllCommentOfVideo=asyncHandler(async(req,res)=>{
    const {videoId} =req.body

    if (!videoId) {
      return ApiError(404,"videoId is required");
    }
    const allComments=await Comment.find({ video:videoId});

    if (allComments) {
      return ApiError(502,"Unable to find comments"); 
    }
    res.json(new ApiResponse(202,allComments,"All comments detail"));

});

const getAllCommentOfTweet=asyncHandler(async(req,res)=>{
    const {tweetId} =req.body

    if (!tweetId) {
      return ApiError(404,"tweetId is required");
    }
    const allComments=await Comment.find({ video:tweetId});

    if (allComments) {
      return ApiError(502,"Unable to find comments"); 
    }
    res.json(new ApiResponse(202,allComments,"All comments detail"));

})

export {createComment,removeComment,editComment,getAllCommentOfVideo,getAllCommentOfTweet};


