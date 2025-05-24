import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required:true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref:"Video"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    }, {
        timestamps:true
    }
)

commentSchema.plugin(mongooseAggregatePaginate)

//the comment here : mongoose.model("Comment",) in the db will be lower case and plural so this will be the name of the collection (collection of documents) name in your db
export const Comment = mongoose.model("Comment",commentSchema)