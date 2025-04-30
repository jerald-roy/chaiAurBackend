import mongoose, { Schema } from "mongoose"

//its same as our normal youtube ok,
//like we have some subscribers to our own channel that is where the (subscriber) feild came in
//channel - just like when we open our youtube we can see the list of the channels we have subscribed
var subscriptionSchema = new Schema({
    subscriber: {
        //one who is subscribing
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Subscription = mongoose.model("Subscription" , subscriptionSchema)