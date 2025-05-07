import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { jwt } from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        var user = await User.findById(userId)
       var accessToken =  user.generateAccessToken()
        var refreshToken = user.generateRefreshToken()
        //now need to store the refresh token inside the db so we have a refresh token feild declared for every user using the mongoose in the user.model using that we will store the refresh token in the db
        user.refreshToken = refreshToken
        //there are 2 ways of writing it to the db one is direct db write : await User.updateOne({ _id: userId }, { refreshToken: newToken }); and the second one is in-memory modification + .save() here we are doing in memory modification
        /* 
        Whenever you use .save(), Mongoose will use the schema to check:

        If all fields follow the correct format

        And if required fields are present and valid

        So even if you're not changing a required field (like password), it must still be there, or .save() will throw a validation error.
        */
        await user.save({ validateBeforeSave: false })
        
        return {accessToken , refreshToken}
    } catch (error) {
        throw new ApiError(500 , "Some internal error while generating access and refresh token")
    }
}

//this method is used to register the user
const registerUser = asyncHandler(async (req, res) => {
    //now we need to wrie a logic for registering the user
    //1.get the details from the frontend
    const { fullname, email, username, password } = req.body

    //2.validation - not empty
    if (
        [fullname,email,username,password].some((feild) => !feild || feild ?.trim() === "")
    ) {
        throw new ApiError(400, "All feilds are required")
    }
    //we can still look for validation like is there @ symbol in the email or in production grade code there will be seperate files for this validation
    //3.check if user already exist :username , email
    //->so here we have to do something with the db and if we are using mongoose schema then for everything that we have to do with the db we use mongoose schema here we need to User schema for validation if the user already exist or not
    //will goona find the first user and returns it 
    // User.findOne({email}) => here we can directly do like this but we wanna check with 2 things so that why we wanna use some operator and here operator starts with dollar sign itseems
    const existingUser = await User.findOne({
        $or : [{username} , {email}]
    })

    if (existingUser) {
        throw new ApiError(409 , "User with email or username already exists")
    }
    //4.check for images , check for avatar if valid upload them on the cloudinary , should check them on both multer and cloudinary and cloudinary is goona return us the URL
    // req.files (.files is given by multer which is an middleware used before the controller) just like how req.body is given by express
    //here we are doing [0] because it goona store things as an object with key as the feild name and value as the array so we do req.files.avatar (we are getting the feild name) and when we are doing req.files.avatar[0] we are using that key's value which is an array inside that first object it looks like this by default it goona store them in the array : 
    /*{
  "avatar": [
    { "fieldname": "avatar", "originalname": "profile.png", "path": "uploads/profile.png" }
  ],
  "coverImage": [
    { "fieldname": "coverImage", "originalname": "cover.png", "path": "uploads/cover.png" }
  ]
}
  */
    //at this point when we are executing the next line what the middleware or the multer is already doing is storing things in the .disk storage and giving it a file name also you can see this in multer.middleware
    //you can still console.log indivisually everything to understand better like what it gives when i do console.log(req.files)
    //why this is local path , its local path because its still on the server
    const avatarLocalPath = req.files?.avatar[0]?.path
    console.log(avatarLocalPath)
   //the above line can give us the problem if we dont pass the avatar file only and ofcourse we are checking with ? operator but its goona return the error of the cannot read the properties of the undefined but below is the classic example of how to check if req.file exist and also to get the path of it

    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    var coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
     
    //here avatar is been given as the required feild in the mongoose schema if avatar has been given to multer so that it shold be stored locally which in turns gives us the path
    //(this is what checking in multer means has it been uploaded to the local server using the multer)
        if(!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required")
    }

    
    //4.(b)upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //(this is what meant by checking in cloudinary has it been uploaded on the cloudinary)
    if (!avatar) {
        throw new ApiError(400 ,"Seems like avatar has been uploaded on the server but could not be uploaded on the cloudinary")
    }
   

    //5.create an object : since we are using schema for mongoose we should create an instance of it otherwise we dont need to push the object we can push the raw data
    //here we are talking to the db while talking to the db there are always 2 things to consider one is it can lead to error but here we are wrapper above that will handle the things for us and the second thing is is takes time(because db is in the other continent)
       //6.once the object is created we should send this object to the db i.e create an entry in the db
   const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
   })
    // you can do like this to check user has created but there is also other ways
    // if (!user) {
    //     throw new ApiError()
    // }
    //db will add its own underscore id to each entry we make
    //so here wat we are doing is communicating with the db so we are using the mongoose schema that is User so we are trying to find the id using the user._id , if it gives back the id then we have successfully created an record in the db
    //another advantage of using this like this and storing them in an variable is now we can just retutn this as only the response but before returning we need to remove the password and the refresh token so that it wont get exposed on the frontend so we use select so unselect the things by using this symbol - 
    console.log(user)
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
  
    if (!createdUser) {
        throw new ApiError(500,"something went wrong the db side while registering the user")
    }
     //7.now we need to send the response back to the user we can just send the simple mssg but here we are trying to send the whole data back to the forntend removing the password and the refresh token  which is done in te above code itself
     //check for the response(user creation) i.e done in the above code only
     //return the response
    return res.status(201).json(
        new ApiResponse(200 , createdUser, "user registed successfully" )
    )
    
   
   
    
})

const loginUser = asyncHandler(async (req, res) => {
    //req body -> take out the data
     
    const { email, username, password } = req.body
    if (!username && !email) {
        throw new ApiError(400 , "username or email is required" )
    }
    //username or email can be validated using
    //find the user
    //this $or operator is just the mongoose operator which tells us that : if the username is there find that or if the email is there find that
     var user =   await User.findOne({
        $or: [{username} , {email}]
  })
    if (!user) {
        throw new ApiError(404 , "user has not been registed or sign up")
    }

//password check
//this can be done using the custom method that we have created from the user model aka userSchema model
 //here we are not using the User but user because User is part of the mongoose and user is the instance that we have received from the above code
    const isPasswordValid = user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401 ,"password incorrect")
    }
    //access and refresh token
    
   //=> this operation of generating the access token and the refesh token is so common that we wanna use it many situations or places , we will create an method for that
    var {accessToken , refreshToken } = await generateAccessAndRefreshTokens(user._id)
    
    //send cookie
    //we can use the above user itself but it does not have complete properties like accessToken and refreshToken and it also has unwanted properties which we dont want to send back to the user like the password
    var loggedInUser = await User.findById(user.id).select("-password -refreshToken")
    //but if you think the above operation is costly try to update the object of the user which is the first time you are getting the data of the user

    //the below step is used to design the cookies
    //the below step allows only the frontend to modify the data and does not allow the backend to modify the data
    const options = {
        httpOnly: true,
        secure:true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(
        200,
        {
            user: loggedInUser, accessToken,
            refreshToken
        },
        "user logged in successfully"
    ))
    //here above res.status(200) is getting resolved to res
    // this values of status 200 is stored inside the res object itself now we have the res object with the data of status
    //since we already have res we can just use .methods on it so every time we do this on certain methods like status , cookies its not sending the response instead resolving it into res object storing the resolved data 
    //but when you use certain .methods like .json and .send then its goona send the data so its very important to chain things accordingly
})

const logoutUser = asyncHandler(async (req, res) => {
   /*
   so here if we remember we always had to send the token at every request from the frontend and we will capitalize this request to get the user info to do this  we will write the custom middleware that runs before this function
   */
   await User.findByIdAndUpdate(
        req.user._id,
        //what you wanna update is next
        {
            $set: {
                refreshToken:undefined
            }
        },
        {
            /*
            The new: true option means:

            ✅ "After updating the document, return the updated version, not the old one."
            */
            new : true
        }
)
const options = {
    httpOnly: true,
    secure:true
    }
return res.status(200).clearCookie("accessToken" , options).clearCookie("refreshToken",options).json(new ApiResponse(200, {} , "user logged out"))
})

//we are writing this handler because we assume that the user wants new token using the refresh token he has
const refreshAccessToken = asyncHandler(async (req, res) => {
    var incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if (!incomingRefreshToken) {
        throw new ApiError(401 , "unauthorized request")
    }

   try {
    var decodedToken =  jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
 
     var user = await User.findById(decodedToken?._id)
 
     if (!user) {
         throw new ApiError(401 , "Invalid refresh token")
     }
 
      /*
       about the error below :
       If no refresh token in DB for that user ID,
       or the token in cookie ≠ token in DB,
       both are caught by the same check ➔ “Refresh token invalid or expired.”
 
       Here are main reasons why it can mismatch:
 
 🔵 User logged out ➔ You deleted refresh token from DB or updated it, but user's old cookie is still being sent.
 
 🔵 Refresh token rotated (new token generated) ➔ DB has new token, cookie has old one.
 
 🔵 Attacker trying to use an old or fake refresh token ➔ Cookie token is random or tampered.
 
 🔵 Manual DB or cookie tampering ➔ e.g., token deleted or modified manually somewhere.
      */
     if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401 , "refresh token is expired or used") 
     }
 
     //now we have made all the checks and everything and its time to generate the new token and send it back in the form of cookies
 
     var options = {
         httpOnly: true,
         secure:true
     }
 
    var {accessToken , newRefreshToken} =  await generateAccessAndRefreshTokens(used._id)
     
     return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", newRefreshToken, options)
         .json(
             new ApiResponse(
                 200,
                 { accessToken,refreshToken:newRefreshToken },
                 "Access token refreshed"
             )
         )
   } catch (error) {
    throw new ApiError(401 , error?.message || "Invalid refresh token")
   }
        
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    //now we need the user who is hitting this route so that we can compare the old password stored in the db as well as the old password he is sending it now so how do we get the user 2. we can get it by the middleware because we have created the middleware which checks the he has the proper access token and adds the user to the req
    var user =await User.findById(req.user?._id)
    //now we have the user the current one who is hitting the end point and we have the password that we are receiving it so we need to check if both are the same but we already have created a function for this
    var isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    
    if (!isPasswordCorrect) {
        throw new ApiError(400 , "Invalid old password")
    }
    //here we just do not want to save to the db just like that so we want to encrpyt and save it so mongoose middlware or the pre hook does that when we use user.save()

    user.password = newPassword

    await user.save({ validateBeforeSave: false })
    
    return res.status(200).json(new ApiResponse(200, {} , "password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200,req.user,"current user fetched successfully"))  
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    //whenever you want to update the image use the seperate controller - production level advice - improves congestion level itseems
    const { fullName, email } = req.body
    if (!fullName || !email) {
        throw new ApiError(400 , "No new updates are detected!")
    }
  const user =  await User.findByIdAndUpdate(
        req.user?._id,
      {
          $set: {
              fullName:fullName,
              email:email
            }
        },
      { new: true })//this new : true just gives back the updated info
    .select("-password")
    
    return res.status(200).json(new ApiResponse(200,user,"Account details updated successfully"))
})

//this controller is used for updating files:
//and this controller is not deleting the existing file thats there in the cloudinary platform
const updateUserAvatar = asyncHandler(async (req, res) => {
    //TODO:need to delete the old avatar from the cloudinary
    const avatarLocalPath = req.file?.path
    
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400,"Error while uploading on avatar")
    }

    const userId = req.user?._id
    //some db call
  const user =   await User.findByIdAndUpdate(userId, {
     $set:{ avatar:avatar.url}
    }, {
      new:true // we need to return it because we need to show right to the frontend the new updated details
    }).select("-password")
    
   return res.status(200).json(new ApiResponse(200 , {user},"avatar updated successfully"))

})
 
const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req?.file.path

    if (!coverImageLocalPath) {
        throw new ApiError(400,"No coverImage has been uploaded!")
    }

    //now should upload on cloudinary
    const userCoverImageObject = await uploadOnCloudinary(coverImageLocalPath)

    if (!userCoverImageObject.url) {
        throw new ApiError(400, "cannot upload the cover Image")
    }
   
    //now get the user so we are indeed using two middlewares on is multer ka middleware and other one is user ka middlerware
   const updatedUser =  await findByIdAndUpdate(req?.user?._id,
        {
             $set:{coverImage:userCoverImageObject.url}
         },
    {new:true}
     ).select("-password")

    return res.status(200).json(new ApiResponse(200 , updatedUser , "cover image has been updated successfully"))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    //so whenever you try to check for the profile you go the specific url and at the end of the url we assume that there is an username
    const { username } = req.params
    //if there is a username exist then trim
    if (!username?.trim()) {
        throw new ApiError(400,"username is missing")
    }

    /*
Purpose: Finds multiple documents matching the query.

Flexible: Can search using any field, not just _id.
    */
    //the result after the aggregate pipeline will be arrays
const channel =   await  User.aggregate([
        {
        $match: {
               username:username?.toLowerCase()
           } 
    }, //we want number of subscribers so we are checking out on channels in the subscription shcema
    // its not actually joining or sort in the db itself instead its just an operation thats giving back some result
    {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as:"subscribers"
        }
    }, //we want number of channels we have subscribed to so we are joining the subscribers in the subscription schema
    {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as:"subscribedTo"
        }
    },
    //adding feild to the existing user model to return
    {
        $addFields: {
            subscribersCount: {
                $size:"$subscribers"
            },
            channelsSubscibedToCount: {
                $size:"$subscribedTo"
            },
            //now we already have 2 added feilds that is subscibers and subscribedTo
            //now we want a way to calculate whether we want to follow or not
            //so if we have logged in we will be having the req.body from there is your user id is matching the any one of the user id that is there in the subscribers which is the newly added feild
            isSubscribed: {
                $cond: {
                    //this in operator is used to check in both the array and the objects
                    if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                    then: true,
                    else:false
                }
            }
        }
    },
    {
        //only i am goona project the selected things
        $project: {
            fullName: 1,
            username: 1,
            subscribersCount: 1,
            channelsSubscibedToCoun: 1,
            isSubscribed: 1,
            avatar: 1,
            coverImage: 1,
            email: 1,
            
        }
    }
    
])
    
    if (!channel?.length) {
      throw new ApiError(404,"channel does not exist")
    }  
    
    return res.status(200).json(
        new ApiResponse(200,channel[0] , "user channel fetched successfully")
    )
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile
}