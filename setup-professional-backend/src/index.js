// require('dotenv').config({path:'./env'})
//but to maintain the consistency of the code we are using the import syntax
/*
Yes! If you load environment variables in index.js (the entry point), they will be available in all other files of your backend automatically.
*/
import dotenv from "dotenv"
import connectDB from "./db/index.js";

//this below code is part of importing the dotenve package
//dotenv.config loads the environment variables into process.env
//REFER MORE ABOUT DOTENV IN THE READ ME.MD FILE
dotenv.config({
    path:'./.env.sample'
})

connectDB()











/*
1st approach:
import express from "express"
const app = express()
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERR: ", error)
            throw error
        })
        //here app.on is run before the app.listen which is actually starting the server because to catch any server-related errors before or when the server starts
        app.listen(process.env.PORT, () => {
            console.log(`App is running on the port ${process.env.PORT}`)
        })
    } catch (err) {
        console.error("ERROR: ", err)
        throw err
        //here we are using throw err because we want to stop the execution of the program here and also , can be caught somewhere meaning a another function or the parent function calling this current function can know that err has happened in this function
    }
})()

*/