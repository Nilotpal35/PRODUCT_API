const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination : (req,file , cb) => {
        cb(null,path.join("store", "images"))
    },
filename : (req, file , cb) => {
    cb(null , file.originalname);
}
})

const fileFilter = (req, file , cb) => {
    const allowedTypes = [".png", ".jpg", ".jpeg", ".gif"]
    if(allowedTypes.includes(path.extname(file.originalname))) {
        cb(null, true)
    } else {
        cb(new Error("FILE TYPE NOT ALLOWED"));
    }
}

const upload = multer({storage : storage , fileFilter : fileFilter})


const multerUtil = (fieldName) => {
    upload.single(fieldName)
}


module.exports = multerUtil