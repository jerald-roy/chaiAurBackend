import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
//this method is used to register the user
const registerUser = asyncHandler(async (req, res) => {
    //now we need to wrie a logic for registering the user
    //1.get the details from the frontend
    const { fullName, email, username, password } = req.body
    console.log("email", email)
    //2.validation - not empty
    if (
        [fullName,email,username,password].some((feild) => !feild || feild ?.trim() === "")
    ) {
        throw new ApiError(400, "All feilds are required")
    }
    //we can still look for validation like is there @ symbol in the email or in production grade code there will be seperate files for this validation
    //3.check if user already exist :username , email
    //->so here we have to do something with the db and if we are using mongoose schema then for everything that we have to do with the db we use mongoose schema here we need to User schema for validation if the user already exist or not
    //will goona find the first user and returns it 
    // User.findOne({email}) => here we can directly do like this but we wanna check with 2 things so that why we wanna use some operator and here operator starts with dollar sign itseems
    const existingUser = User.findOne({
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
    const coverImageLocalPath = req.files?.coverImage[0]?.path

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
   const user =  User.create({
        fullName,
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

export {registerUser}