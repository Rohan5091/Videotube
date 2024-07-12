import {Router} from "express";
import { createAcount,login,logout,getProfile,editProfile } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { isloggedIn } from "../middlewares/auth.middleware.js";
const userRouter=Router();

userRouter.post("/register",upload.fields([
    {name:"avatar",maxCount:1},
    {name:"coverImage",maxCount:1}
]),createAcount)

userRouter.post("/login",login);
userRouter.get("/logout",logout);
userRouter.get("/profile",isloggedIn,getProfile);
userRouter.put("/editProfile",isloggedIn,editProfile);

export default userRouter;

