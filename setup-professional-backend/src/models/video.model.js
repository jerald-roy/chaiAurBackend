import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const videoSchema = new Schema({
    videoFile: {
        type: String,//which is an cloudinary url
        //video ke schema me video compulsory hai!
        required:true  
    },
    thumbnail: {
        type: String, //comes from cloudinary
        required:true
    },
    title: {
        type: String, 
        required:true
    },
    description : {
        type: String, 
        required:true
    },
    duration : {
        type: String, //comes from cloudinary
        required:true
    },
    views: {
        type: Number,
        default:0
    },
    isPublished: {
        type: Boolean,
        default:true
    },
    owner: {
        //this lines tells we need a reference from another
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},
    {
    timestamps:true
})

//plugin : It lets you add predefined logic (like pagination, timestamps, soft delete, etc.) to all documents of that model.
videoSchema.plugin(mongooseAggregatePaginate)
// Just adds the ability to use .aggregatePaginate() later.
//even in the case of paginate you need to set up things in the similar way
//paginate : just gives the result in the form of pages not as a whole like a single page

export const Video = mongoose.model("Video" , videoSchema)