import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Video from "../moddels/video.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../moddels/user.model.js";

const createVideo = asyncHandler(async (req, res,next) => {
    
     const { id } = req.user.id;
      
     const user= await User.findById(id);

     if (!user) {
       return ApiError(404,"User not found");
     }

     const { videoFile, thumbnail, title, description, category ,isPublished} = req.body;

     if (!videoFile || !thumbnail || !title || !description || !category) {
       return ApiError(400,"Please fill in all fields");
      };


      const video = {
        videoFile,
        thumbnail,
        title,
        description,
        category,
        owner: id,
        isPublished,
      };

      const newVideo = new Video(video);
      await newVideo.save();

     res.json(new ApiResponse(201,newVideo,"Video created successfully")) ;

});

const updateVideo = asyncHandler(async (req, res,next) => {
    
  const userId = req.user.id;
  if (!userId) {
    return ApiError(404,"userId is required");
  }
  const user= await User.findById(userId);

  if (!user) {
    return ApiError(404,"User not found");
  }

  const { title, description,isPublished,videoId} = req.body;

  const video = await Video.findById(videoId);

  if (!video) {
    return ApiError(404,"Video not found");
  }

  if(video.owner.toString() !== id){
    return ApiError(401,"You are not authorized to update this video");
  }
  
  if (title) {
    video.title = title;
  }
  if (description) {
    video.description = description;
  }
  if (isPublished) {
    video.isPublished = isPublished;
  }

  await video.save();
  
   res.json(new ApiResponse(201,video,"Video created successfully"));

});

const deleteVideo = asyncHandler(async (req, res,next) => {
    
  const userId = req.user.id;
  if (!userId) {
    return ApiError(404,"userId is required");
  }
  const user= await User.findById(userId);

  if (!user) {
    return ApiError(404,"User not found");
  }

  const {videoId} = req.body;
  
  if(!videoId){
    return ApiError(404,"Video Id is required");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    return ApiError(404,"Video not found");
  }

  if(video.owner.toString() !== id){
    return ApiError(401,"You are not authorized to update this video");
  }

   await video.remove();

   res.json(new ApiResponse(201,null,"Video removed successfully"));

});

const getVideo = asyncHandler(async (req, res,next) => {
    
    const { videoId } = req.params;
    const userId = req.user.id;

    const video = await Video.findById(videoId);

    if (!video) {
      return ApiError(404,"Video not found");
    }
    const user= await User.findById(userId);

    if (!user) {
        video.views+=1;
        await video.save();
        res.json(new ApiResponse(200,video,"Video fetched successfully"));
    }
    user.watchHistory.push(video._id);
    video.views+=1;
    await user.save();
    await video.save();

    res.json(new ApiResponse(200,video,"Video fetched successfully"));

});

const getAllVideosOfUser = asyncHandler(async (req, res,next) => {

  const { userId } = req.body;

  const user= await User.findById(userId);

  if (!user) {
    return ApiError(404,"User not found");
  }

  const allVideo=await Video.find({owner:userId});

  res.json(ApiResponse(201,allVideo,"All videos detail"));

});

const getAllVideos=asyncHandler(async (req,res)=>{
   
   const allVideos=await Video.find({});

   if (!allVideos) {
     return ApiError(502,"server error");
   }

   res.json(ApiResponse(202,allVideos,"All videos detels"));

});


export { createVideo, getVideo, updateVideo,deleteVideo,getAllVideosOfUser,getAllVideos};

