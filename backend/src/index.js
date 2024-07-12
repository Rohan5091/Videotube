import dotenv from "dotenv"
dotenv.config();
import {app} from "./app.js"
import connectDB from "./db/index.js";
import cloudinary from "cloudinary";


const PORT=process.env.PORT || 7001
connectDB()
.then(()=>{
   app.listen(PORT,()=>{
      console.log(`server is running at port ${PORT}`);
   })
})

cloudinary.config({ 
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
 });
 
