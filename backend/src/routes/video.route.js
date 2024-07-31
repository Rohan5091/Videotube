import { Router } from "express";
import { createVideo, deleteVideo, getAllVideos, getAllVideosOfUser, getVideo, updateVideo } from "../controllers/video.controler.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isloggedIn } from "../middlewares/auth.middleware.js";

const route=Router();

route.post("/upload",isloggedIn,
  upload.fields([
    {name:"videoFile",maxCount:1},
    {name:"thumbnail",maxCount:1},
  ])
  ,createVideo);

route.delete("/remove",isloggedIn,deleteVideo);
route.put("/update",isloggedIn,updateVideo);

route.get("/get-user-all-videos",getAllVideosOfUser);
route.get("/get-all-videos",getAllVideos);

route.get("/get-video",getVideo);


export default route;