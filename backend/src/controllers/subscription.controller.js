import Subscription from "../moddels/subscription.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const subscribe=asyncHandler(async (req,res)=>{
   const userId=req.user.id;
   if (userId) {
     return ApiError(404,"userId is required")
   }

   const {channelId}=req.body

   if (!channelId) {
     return ApiError(404,"channel Id id required")
   }

   const subscription=new Subscription({
     channel:channelId,
     subscriber:userId
   })
   
   await subscription.save();

   res.json(new ApiResponse(202,subscription,"subscribed successfully"))

});

const getAllSubscriber=asyncHandler(async (req,res)=>{
     const {userId}=req.body;

     if (!userId) {
       return ApiError(404,"user id is required")
     }

     const subscription=Subscription.findOne({channel:userId});

     if (!subscription) {
      return ApiError(404,"create videtube channel")
     }
   
     const subscribers=Subscription.find({channel:userId}).select("subscriber");

     if (!subscribers) {
       return ApiError(502,"not able to get subscriber")
     }

     res.json(new ApiResponse(202,subscribers,"subscribers detail"));

});

const getAllChannels=asyncHandler(async (req,res)=>{
  const {userId}=req.body;

  if (!userId) {
    return ApiError(404,"user id is required")
  }

  const subscription=Subscription.findOne({subscriber:userId});

  if (!subscription) {
   return ApiError(404,"create videtube account")
  }

  const channels=Subscription.find({subscriber:userId}).select("channel");

  if (!channels) {
    return ApiError(502,"not able to get subscriber")
  }

  res.json(new ApiResponse(202,channels,"channels detail"));

});

export {subscribe,getAllSubscriber,getAllChannels};
