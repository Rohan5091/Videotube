import mongoose from "mongoose";
import bcrypt from "bcrypt";
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
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    refreshToken: {
      type: String,
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

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateRefreshToken = function () {
  return 
  jwt.sign({ 
    id: this._id,
   }, 
    process.env.REFRESH_TOKEN_SECRET, 
    {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
  });
};
userSchema.methods.generateAccessToken = function () {
  return 
  jwt.sign({ 
    id: this._id,
    email: this.email,
    userName: this.userName,
    fullName: this.fullName,
   }, 
    process.env.ACCESS_TOKEN_SECRET, 
    {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
  });
};

const User = mongoose.model("User", userSchema);
export default User;

