import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
//you can name this anything you want
const app = express()

//its some setting to set up the cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

//this below setting is used when the data is sent in the form of the json
app.use(express.json({limit:"16kb"}))

//this middleware is used when data is sent in the form of url , different url has different conversion settings
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

//this setting is used if you wanna store any static files or pdf / images in the server
app.use(express.static("public"))

//this setting allows you to make crud operation to the cookies that exist on the browser
app.use(cookieParser())
export {app}