import User from "../moddels/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {emailValidate,passwordValidate} from "../constants.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js";



const createAcount =asyncHandler(async(req,res)=>{

    const {userName,fullName,email,password}=req.body;


    if (!userName.trim() || !fullName.trim() || !email.trim() || !password.trim()) {
        throw new ApiError(404,"All fields are required")
    }

    if (password.length < 6) {
        throw new ApiError(404,"Password must be at least 6 characters");
    }
    if (!email.match(emailValidate)) {
        throw new ApiError(404,"Enter correct email formate") ;
     }
     
    if (!password.match(passwordValidate)) {
        throw new ApiError(404,"Enter correct password formate");
     }

     let Existuser = await User.findOne({
        $or: [{ userName }, { email }],
     })
     if(Existuser){
        throw new ApiError(404,"Username or email already exists");
     }
    // Check if 'avatar' file is present
    if (!req.files.avatar || req.files.avatar.length === 0) {
      throw new ApiError(404,"Avatar is required");
     }
    const avatarFilePath=req.files.avatar[0].path;
    const coverImageFilePath = req.files?.coverImage && req.files.coverImage.length > 0
    ? req.files.coverImage[0].path
    : "";
     // Use an empty string or any default value if 'coverImage' is not provided

    if(!avatarFilePath){
        throw new ApiError(404,"Avatar is required");  
    }
    const avatar=await uploadOnCloudinary(avatarFilePath);
    console.log(avatar);

    //if 'coverImage' is provided, upload it to Cloudinary
    const coverImage=coverImageFilePath ? await uploadOnCloudinary(coverImageFilePath): "";
    
    if (!avatar) {
        throw new ApiError(404,"Avatar is required");   
    }

     const user=await User.create({
        userName,
        fullName,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    });

    await user.save();
    
    const accessToken= await user.generateAccessToken(); 
    const refreshToken=await user.generateRefreshToken();
    

    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:true
    });

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true
    });

    user.refreshToken=refreshToken;
    await user.save();
    user.password=undefined;
   
    
    res.json(new ApiResponse(201,user,"User created successfully"));
});

const login=asyncHandler(async(req,res)=>{  

    const {userName,email,password}=req.body;
    
    
    if (!email && !userName) {
        throw new ApiError(404,"user Name or email is requird");
    }
    
    if (password.length < 6) {
      throw new ApiError(404,"Password must be at least 6 characters");
    }
   if (email && !email.match(emailValidate)) {
     throw new ApiError(404,"Enter correct email formate");
   }
   
   if (!password.match(passwordValidate)) {
     throw new ApiError(404,"Enter correct password formate");
   }

    const user=await User.findOne({
        $or:[{email},{userName}]
    }).select("+password");

    if (!user) {
        throw new ApiError(404,"User not found");
    }

    const isMatch=await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(404,"Invalid email or password");
    }
   

    const accessToken=await user.generateAccessToken(); 
    const refreshToken=await user.generateRefreshToken();
   

    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        sameSite:true,
        secure:true
    });

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true
    });

    user.refreshToken=refreshToken;
    await user.save();
    user.password=undefined;

    res.json(new ApiResponse(200,user,"User login successfully"));
    
});

const logout=asyncHandler(async(req,res)=>{
    const userId=req.user.id;
    const user=await User.findById(userId);
    if (!user) throw new ApiError(404,"unauthorised Access");
    user.refreshToken="";
    await user.save();
    req.cookies.accessToken && res.clearCookie("accessToken");
    req.cookies.refreshToken && res.clearCookie("refreshToken");
    res.json(new ApiResponse(200,"User logout successfully"));
});

const getProfile=asyncHandler(async(req,res)=>{
    const userId=req.user.id;
     if(!userId){
        throw new ApiError(500,"userId is required");
     }

    const user=await User.findById(userId); 

    if (!user) {
      throw new ApiError(404,"User not found");
     }

    res.json(new ApiResponse(200,user,"User details"));


});

const editProfile=asyncHandler(async(req,res)=>{
    const userId=req.user.id;
    const {userName,fullName,oldPassword,newPassword}=req.body;
    const user=await User.findById(userId).select("+password");
    if(!user){
        throw new ApiError(404,"User not found");
    }
    
    if (userName) {
      const Existuser = await User.findOne({
        userName,
      });   
        if (Existuser) {
            throw new ApiError(404,"Username already exists");
        }
       user.userName=userName;
    }
    if (fullName) {
      user.fullName=fullName;
    }
    
    if (oldPassword) {
      const isMatch=await user.comparePassword(oldPassword);

      if (!isMatch) {
          throw new ApiError(404,"Invalid  password");
      }
        if (newPassword.length < 6) {
            throw new ApiError(404,"Password must be at least 6 characters");
        }
        if (!newPassword.match(passwordValidate)) {
            throw new ApiError(404,"Enter correct password formate");
        }
       user.password=newPassword;
    }

    // Check if 'coverImage' file is present
    const coverImageFilePath = req.files?.coverImage && req.files.coverImage.length > 0
    ? req.files.coverImage[0].path
    : "";

    // Use an empty string or any default value if 'coverImage' is not provided
    const avatarFilePath = req.files?.avatar && req.files.avatar.length > 0
    ? req.files.avatar[0].path
    : "";
    
    if (avatarFilePath) {
        const avatar = await uploadOnCloudinary(avatarFilePath);
        user.avatar = avatar.url;
        }
    if (coverImageFilePath) {
        const coverImage = await uploadOnCloudinary(coverImageFilePath);
        user.coverImage = coverImage.url;
        }
    await user.save();
    user.password=undefined;
    res.json(new ApiResponse(200,user,"user details edited successfully"));
});


export {createAcount,login,logout,getProfile,editProfile};
