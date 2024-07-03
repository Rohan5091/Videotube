import { Router } from "express";
import { createVideo, deleteVideo, getAllVideos, getAllVideosOfUser, getVideo, updateVideo } from "../controllers/video.controler";

const route=Router();

route.post("/upload",createVideo);
route.delete("/remove",deleteVideo);
route.put("/update",updateVideo);

route.get("/get-user-all-videos",getAllVideosOfUser);
route.get("/get-all-videos",getAllVideos);

route.get("/get-video",getVideo);


export default route;