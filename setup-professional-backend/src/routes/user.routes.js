import { Router } from "express"
import { loginUser, registerUser , logoutUser , refreshAccessToken , changeCurrentPassword , getCurrentUser ,  updateAccountDetails, updateUserAvatar, updateUserCoverImage} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/authCustom.js"
//here we are using the below import called as upload because we wanna take the files also like(avatar or image)from the user and this upload is nothing but the middleware of the express that we use it to store locally on the server for some time before uploading it to the cloudinary
import {upload} from "../middlewares/multer.middleware.js"
const router = Router()

//this is how we execute the any middleware in this case multer ka middleware just before the controller ok and upload. gives us many options but here we are choosing .feild because we need to take the input from the multiple feilds so we are accepting an array of objects
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
            
        },
        {
            //when sending the feild the feild name should also be coverImage
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)
export default router