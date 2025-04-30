import multer from "multer"

/*
In multer.diskStorage({...}), both destination and filename functions get cb as an argument:
cb = callback
*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
   
    cb(null, file.originalname); //this is place or this line is the reason where you can access the file from the server in the controller logic
    }
});
    
export const upload = multer({storage:storage})