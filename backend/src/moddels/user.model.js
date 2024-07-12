import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "full Name is required"],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      requird: [true, "password is required"],
      select: false,
    },
    avatar: {
      type: String,
      required: [true, "avatar is required"],
    },
    refreshToken: {
      type: String,
      select: false
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password =await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateRefreshToken = async function () {
  try {
    const token=await jwt.sign({ 
      id: this._id,
     }, 
      process.env.ACCESS_TOKEN_SECRET, 
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
    });
    return token;
   
  } catch (error) {
    console.log(error.message);
  }
};
userSchema.methods.generateAccessToken=async function () {
   try {
     const token=await jwt.sign({ 
       id: this._id,
       email: this.email,
       userName: this.userName,
       fullName: this.fullName,
      }, 
       process.env.ACCESS_TOKEN_SECRET, 
       {
         expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
     });
     return token;
    
   } catch (error) {
     console.log(error.message);
   }
   
};

const User = mongoose.model("User", userSchema);
export default User;

