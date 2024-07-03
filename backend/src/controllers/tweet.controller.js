import Tweet from "../moddels/tweet.model.js";
import User from "../moddels/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


 const createTweet=asyncHandler(async (req,res)=>{
//     const userId=req.user.id;

//     const user=await User.findById(userId);

//     if (!user) {
//       return ApiError(404,"user not found");
//     }

//     const {videoId,TweetText,tweetId}=req.body;

//     if(!TweetText){
//        return ApiError(401,"Tweet text is required");
//     }
//     let Tweet;

//     await Tweet.save();

//     res.json( new ApiResponse(202,"Tweet is created",Tweet));

 });

const removeTweet=asyncHandler(async (req,res)=>{
  const userId=req.user.id;

  const user=await User.findById(userId);

  if (!user) {
   return ApiError(404,"user not found");
  }
  const {tweetId}=req.body

  if (!tweetId) {
   return ApiError(404,"tweetId is not found");
  }

  await Tweet.findByIdAndDelete(tweetId);

  res.json(new ApiResponse(202,"Tweet deleted successfully"));

});

const editTweet=asyncHandler(async (req,res)=>{
  const userId=req.user.id;

  const user=await User.findById(userId);

  if (!user) {
    return ApiError(404,"user not found");
  }

  const {tweetId,TweetText}=req.body

  if (!tweetId || !TweetText) {
   return ApiError(404,"tweetId or TweetText is required");
  }

  const tweet=await Tweet.findByIdAndUpdate(tweetId,{content:TweetText});

  res.json(new ApiResponse(202,tweet,"Tweet updated successfully"));

});

const getAllTweetOfUser=asyncHandler(async(req,res)=>{
    const {userId} =req.body

    if (!userId) {
      return ApiError(404,"userId is required");
    }
    const allTweets=await Tweet.find({ owner:userId});

    if (allTweets) {
      return ApiError(502,"Unable to find Tweets"); 
    }
    res.json(new ApiResponse(202,allTweets,"All Tweets detail"));

});


export {createTweet,removeTweet,editTweet,getAllTweetOfUser};


