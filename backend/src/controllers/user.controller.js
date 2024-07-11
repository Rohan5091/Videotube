import User from "../moddels/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {emailValidate,passwordValidate} from "../constants.js"


const createAcount =asyncHandler(async(req,res)=>{

    const {userName,fullName,email,password}=req.body;


    if (!userName.trim() || !fullName.trim() || !email.trim() || !password.trim()) {
        throw new ApiError(404,"All fields are required")
    }

    if (password.length < 6) {
        throw new ApiError(404,"Password must be at least 6 characters");
    }
    // if (!email.match(emailValidate)) {
    //     throw new ApiError(404,"Enter correct email formate") ;
    //  }
     
    // if (!password.match(passwordValidate)) {
    //     throw new ApiError(404,"Enter correct password formate");
    //  }
     let Existuser = await User.findOne({
        $or: [{ userName }, { email }],
     })
     if(Existuser){
        throw new ApiError(404,"Username already exists");
     }
     

    if (!userName || !fullName || !email || !password) {
        throw new ApiError(404,"All fields are required");
    }

     const user=await User.create({
        userName,
        fullName,
        email,
        password
    });

    const accessToken=user.generateAccessToken(); 
    const refreshToken=user.generateRefreshToken();

    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        sameSite:true
    });

    user.refreshToken=refreshToken;
    await user.save();
    user.password=undefined;
    res.json(new ApiResponse(201,user,"User created successfully"));
});

const login=asyncHandler(async(req,res)=>{  
    const {email,password}=req.body;

    if (!email || !password) {
        return ApiError(404,"All fields are required");
    }
    
    if (password.length < 6) {
      return ApiError(404,"Password must be at least 6 characters");
    }
   if (!email.match(emailValidate)) {
     return ApiError(404,"Enter correct email formate");
   }
   
   if (!password.match(passwordValidate)) {
     return ApiError(404,"Enter correct password formate");
   }

    const user=await User.findOne({email});

    if (!user) {
        return ApiError(404,"User not found");
    }

    const isMatch=await user.comparePassword(password);

    if (!isMatch) {
        return ApiError(404,"Invalid email or password");
    }

    const accessToken=user.generateAccessToken(); 
    const refreshToken=user.generateRefreshToken();

    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        sameSite:true
    });

    user.refreshToken=refreshToken;
    await user.save();

    res.json(new ApiResponse(200,user,"User login successfully"));
    
});

const logout=asyncHandler(async(req,res)=>{
    res.clearCookie("accessToken");
    res.json(new ApiResponse(200,"User logout successfully"));
});

const getProfile=asyncHandler(async(req,res)=>{
    const userId=req.user.id;

    const user=await User.findById(userId); 

    if (!user) {
      return ApiError(404,"User not found");
     }

    res.json(new ApiResponse(200,user,"User details"));


});

const editProfile=asyncHandler(async(req,res)=>{
    const userId=req.user.id;
    const {userName,fullName,oldPassword,newPassword,coverImage,avatar}=req.body;

    const user=User.findById(userId);
    
    if (userName) {
      user.userName=userName;
    }
    if (fullName) {
      user.fullName=fullName;
    }
    
    if (oldPassword) {
      const isMatch=await user.comparePassword(oldPassword);

      if (!isMatch) {
          return ApiError(404,"Invalid  password");
      }
      user.password=newPassword;
    }

    await user.save();

    res.json(new ApiResponse(200,user,"user details edited successfully"));
});


export {createAcount,login,logout,getProfile,editProfile};
