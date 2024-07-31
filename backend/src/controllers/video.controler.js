import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Video from "../moddels/video.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../moddels/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createVideo = asyncHandler(async (req, res,next) => {
    
     const userId = req.user._id;
     
     const user= await User.findById(userId);
    
     if (!user) {
        throw new ApiError(404,"User not found");
     }

     const { title, description, category ,isPublished} = req.body;

     if (!title || !description || !category) {
       throw new ApiError(400,"Please fill in all fields");
      };

      if (!req.files.videoFile || req.files.videoFile.length===0) {
         throw new ApiError(400,"videoFile field is required"); 
      }

      if (!req.files.thumbnail || req.files.thumbnail.length===0) {
         throw new ApiError(400,"thumbnail field is required"); 
      }
       
      const thumbnailPath=req.files.thumbnail[0].path;
      const videoFilePath=req.files.videoFile[0].path;

      if (!videoFilePath || !thumbnailPath) {
        throw new ApiError(500,"videoFilePath or thumbnailPath not found "); 
      }
       
      const thumbnail= await uploadOnCloudinary(thumbnailPath);
      const videoFile= await uploadOnCloudinary(videoFilePath);
      
      if (!(videoFile && videoFile.url ) || !(thumbnail && thumbnail.url)) {
        throw new ApiError(500,"cloudinary error"); 
      }


      const video = {
        vodeoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        category,
        owner: userId,
        isPublished,
      };

      const newVideo = new Video(video);
      await newVideo.save();

     res.json(new ApiResponse(201,newVideo,"Video created successfully")) ;

});

const updateVideo = asyncHandler(async (req, res,next) => {
    
  const userId = req.user._id;
  if (!userId) {
    return ApiError(404,"userId is required");
  }
  const user= await User.findById(userId);

  if (!user) {
    throw new ApiError(404,"User not found");
  }

  const { title, description,isPublished,videoId} = req.body;
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404,"Video not found");
  }
  

  if(video?.owner.toString() !== userId.toString()){
    throw new ApiError(401,"You are not authorized to update this video");
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
    
  const userId = req.user._id;
  if (!userId) {
    throw new  ApiError(404,"userId is required");
  }
  const user= await User.findById(userId);

  if (!user) {
    throw new  ApiError(404,"User not found");
  }

  const {videoId} = req.body;
  
  if(!videoId){
    throw new  ApiError(404,"Video Id is required");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new  ApiError(404,"Video not found");
  }

  if(video.owner.toString() !== userId.toString()){
    throw new  ApiError(401,"You are not authorized to update this video");
  }
  await video.deleteOne()
  
   res.json(new ApiResponse(201,null,"Video removed successfully"));

});

const getVideo = asyncHandler(async (req, res,next) => {
    
    const { videoId } = req.query;
    const {userId} = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      throw new  ApiError(404,"Video not found");
    }
    const user= await User.findById(userId);

    if (!user) {
        // video.views+=1;
        // await video.save();
        // res.json(new ApiResponse(200,video,"Video fetched successfully"));
      throw new  ApiError(404,"user not found");
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
    throw new  ApiError(404,"User not found");
  }

  const allVideo=await Video.find({owner:userId});

  res.json(new ApiResponse(201,allVideo,"All videos detail"));

});

const getAllVideos=asyncHandler(async (req,res)=>{
   
   const allVideos=await Video.find({});

   if (!allVideos) {
    throw new  ApiError(502,"server error");
   }

   res.json(new ApiResponse(202,allVideos,"All videos detels"));

});


export { createVideo, getVideo, updateVideo,deleteVideo,getAllVideosOfUser,getAllVideos};

