
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import ApiError from './ApiError.js';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary= async (localfilePath) => {
  try {
    if (!localfilePath) {
       throw new ApiError(404,"local path does not exist")
    }
    const result = await cloudinary.uploader.upload(localfilePath,{
      folder: 'Videotube',
      resource_type: 'auto',
    });
    console.log(" uploaded to cloudinary ",result.secure_url)
    return result;

  }catch(err){
    // delete the file if it was not uploaded to cloudinary
    fs.unlinkSync(localfilePath);
    throw new ApiError(500,err.message);
  }
}
