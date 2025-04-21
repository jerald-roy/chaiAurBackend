import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model"


//so next is used to go for the next middleware or the rotue itself which is an end point for the next ok so we should not only define the function of the middleware but also declare it right just before the controller of the route

export const verifyJWT = asyncHandler(async (req, res, next) => {
    //tutor said its an database operation so it will be better if we put things on try catch block
  try {
      var token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
      if (!token) {
          throw new ApiError(401, "Unauthorized request")
      }
  
      var decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      
      var user = await User.findById(decodedToken?._id).select("-password -refreshToken")
  
      if (!user) {
          throw new ApiError("401", "Invalid access token")
          
      }
      //here we are adding the new value to the req object
      //req is nothing but the data coming from the user
      req.user = user
      next()
  } catch (error) {
    throw new ApiError(401 , error?.message || "Invalid access token" )
  }
})