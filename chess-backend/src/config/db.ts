import mongoose, { connections } from "mongoose"
import dotenv from "dotenv"

dotenv.config({path:".env.development"})

export const connectDb= async ()=>{
    try{
       const Connection= await mongoose.connect(process.env.MONGO_URI || "")
       console.log(`MONGO-DB Connected:${Connection.connection.name}`)
    }
    catch(error: any){
       console.error(`ERROR:${error.message}`)
       process.exit(1)
    }

}