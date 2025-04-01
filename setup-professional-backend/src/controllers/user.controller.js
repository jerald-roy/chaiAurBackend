import { asyncHandler } from "../utils/asyncHandler.js";

//this method is used to register the user
const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message:"ok"
    })
})

export {registerUser}