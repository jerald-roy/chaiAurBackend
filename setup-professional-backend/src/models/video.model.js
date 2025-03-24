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

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video" , videoSchema)