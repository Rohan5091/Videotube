import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../moddels/user.model.js";

const isloggedIn = asyncHandler(async(req,res,next)=>{
   try {
      const token=req.cookies?.accessToken || req.header("Authorisation")?.replace("Bearer ","")
      if (!token) throw new ApiError(404,"Access token not found");
      const tokenData=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
      const user=await User.findById(tokenData.id);
      if(!user) throw new ApiError(404,"unauthorised Access")
      req.user=user;
      next();

   } catch (error) {
      throw new ApiError(400,error?.message || "something went will decoding access token")
   }
})

export { isloggedIn };