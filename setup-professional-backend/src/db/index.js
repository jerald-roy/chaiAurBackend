import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        //mongoose actually give back the object of the connection instance
        console.log(`\n MongoDB connected !! : DB HOST : ${connectionInstance.connection.host}`)
    } catch (err) {
        console.error("MongoDB connection failed :" ,  err)
        process.exit(1) 
        //1 exit code - general failure
    }
}

export default connectDB