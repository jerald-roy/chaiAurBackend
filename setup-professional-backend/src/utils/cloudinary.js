import { v2 as cloudinary } from "cloudinary"
//read more about fs on readme.md
import fs from "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
       var response = await cloudinary.uploader.upload(localFilePath, {
           public_id:'hello avatar'
        })
        fs.unlinkSync(localFilePath)
        return response
    } catch (err) {
        //if any case the file has not been uploaded on the cloudinary maybe its the case that file can be malicious in that case we also want to remove it from the server and it should be sync way meaning : it should first remove the file from the server and then continue doing other things , so we are just unlinking
        fs.unlinkSync(localFilePath)
        console.log('this error is something related to images or vidoes' ,err)
        return null
    }
}

export {uploadOnCloudinary}