import {Router} from "express";
import { createAcount,login,logout,getProfile,editProfile } from "../controllers/user.controller.js";

const userRouter=Router();

userRouter.post("/register",createAcount);
userRouter.post("/login",login);
userRouter.get("/logout",logout);
userRouter.get("/profile",getProfile);
userRouter.put("/edit-profile",editProfile);

export default userRouter;

