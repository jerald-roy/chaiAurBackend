// require('dotenv').config({path:'./env'})
//but to maintain the consistency of the code we are using the import syntax
/*
Yes! If you load environment variables in index.js (the entry point), they will be available in all other files of your backend automatically.
*/
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
//this below code is part of importing the dotenve package
//dotenv.config loads the environment variables into process.env
//REFER MORE ABOUT DOTENV IN THE READ ME.MD FILE
dotenv.config({
    path:'./.env.sample'
})

/*An async function always returns a Promise so that the calling (parent) function can know what happened inside it.
so here connectDB is an async function and its returning a promise
*/
//frist we want to make the db connection this is happening thorugh different port and then once the db got connected only then we should start the server on the different port
connectDB()
    .then(() => {
        //this first para is just called as an event but ntg more than a string that helps us to identify if there are any errors
        const server =    app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`)
        })
        //what the server.on is going to log back is predefined erros
        server.on("error", (error) => {
            console.log(`Err : ${error}`)
            throw error
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! " , err)
    })
     
/*
You're right that .catch() only handles connection (DB) errors, not server errors.
But server errors (like port issues) happen after then() runs, so they won’t be caught by .catch().

So, when you throw inside server.on("error"), it:
✅ Stops only that execution (doesn't crash the entire app immediately).
✅ Prevents the app from running with a broken server.
*/










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