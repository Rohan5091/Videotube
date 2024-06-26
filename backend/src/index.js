import dotenv from "dotenv"
dotenv.config();
import {app} from "./app.js"
import connectDB from "./db/index.js";


const PORT=process.env.PORT || 7001

connectDB()
.then(()=>{
   app.listen(PORT,()=>{
      console.log(`server is running at port ${PORT}`);
   })
})


