import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        //In Mongoose, the trim option removes leading and trailing spaces from a string before saving it to the database
        index: true,
        //As an overview, you can think of indexing as searching within a specific segment instead of scanning everything.Without an index → MongoDB scans all documents to find a match. With an index → MongoDB quickly finds the relevant segment and fetches results faster

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
   fullname : {
        type: String,
        required: true,
       trim: true,
        index:true
    },
    avatar: {
        type: String, //cloudinary ka url 
        required: true,
    },
    coverImage: {
        type: String, //cloudinary ka url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password: {
        type: String,
        required:[true , 'Password is required']
    },
    refreshToken: {
        type:String
    }
}, {
    timestamps:true
})

userSchema.pre("save", async function (next) {
    if (!(this.isModified("password"))) return next()
    //When you call next() without any arguments inside a Mongoose pre middleware, it simply continues the normal save process.
    this.password = bcrypt.hash(this.password, 10)
    next()
    //this above line takes the password from the schema
    //here we introduce an problem ? everytime some thing a user changes like an avatar this .pre function run again which we dont want because he has to changed the password so we are using if condition
})
//just before the save event we wanna do something that is decrypt more on readme.md file
// we can't use arrow function inside the 2 paramter because hitesh sir told (this ka reference nahi hota , it should known the contenxt) should read more about it ???

//this below is an custom method

userSchema.methods.isPasswordCorrect = async function (password) {
 return  await bcrypt.compare(password , this.password )
}

//here bcrypt.compare is accepting 2 parameters one is the normal password the user enters it only takes it in the form of string ok and the actual password that is stored inside the db which is somesort of the hash value so we are comparing both of them

//the below method is also the custom method used for generating the first new token for this we some info from the user
userSchema.methods.generateAccessToken = function () {
   return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName:this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
       
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , userSchema)