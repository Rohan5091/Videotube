import Tweet from "../moddels/tweet.model.js";
import User from "../moddels/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


 const createTweet=asyncHandler(async (req,res)=>{
    const userId=req.user.id;

    const user=await User.findById(userId);

    if (!user) {
      return ApiError(404,"user not found");
    }

    const {TweetText}=req.body;

    if(!TweetText){
       return ApiError(401,"Tweet text is required");
    }
    
   
    const imageFilepath=req.files?.imageFile && req.files.imageFile.length>0 
    ?req.files.imageFile[0].path
    :"";
    
    const imageFile=imageFilepath?await uploadOnCloudinary(imageFilepath):"";
    
    const tweet= new Tweet({
      imageFile:imageFile?imageFile.url:undefined,
      content:TweetText,
      owner:userId
    })
    await tweet.save();

    res.json( new ApiResponse(202,"Tweet is created",tweet));

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

  const tweet=await Tweet.findById(tweetId);

  if (!tweet) {
    return ApiError(404,"tweet not found");
  }

  if(tweet.owner.toString()!==userId.toString()){
    return ApiError(401,"You are not authorized to delete this tweet");
  }
  await tweet.deleteOne();
  res.json(new ApiResponse(202,"Tweet deleted successfully"));

});

const editTweet=asyncHandler(async (req,res)=>{
  const userId=req.user.id;

  const user=await User.findById(userId);

  if (!user) {
    throw new ApiError(404,"user not found");
  }

  const {tweetId,TweetText}=req.body

  if (!tweetId || !TweetText) {
    throw new ApiError(404,"tweetId or TweetText is required");
  }
  const tweet=await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404,"tweet not found");
  }
  if(tweet.owner.toString()!==userId.toString()){
    throw new ApiError(401,"You are not authorized to delete this tweet");
  }
  const tweetImagepath=req.files?.imageFile && req.files.imageFile.length>0 
  ?req.files.imageFile[0].path
  :"";
  const imageFile=tweetImagepath?await uploadOnCloudinary(tweetImagepath):"";


  if (imageFile) {
      tweet.imageFile=imageFile.url;
   }
  tweet.content=TweetText;

  await tweet.save();
  res.json(new ApiResponse(202,tweet,"Tweet updated successfully"));

});

const getAllTweetOfUser=asyncHandler(async(req,res)=>{
    const {userId} =req.body

    if (!userId) {
      throw new ApiError(404,"userId is required");
    }

    const allTweets=await Tweet.findOne({ owner:userId});

    if (!allTweets) {
      throw new ApiError(502,"Unable to find Tweets"); 
    }

    res.json(new ApiResponse(202,allTweets,"All Tweets detail"));

});


export {createTweet,removeTweet,editTweet,getAllTweetOfUser};


