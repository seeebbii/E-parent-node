const path = require('path')
const multer = require('multer')
 
var storage = multer.diskStorage({
    destination: function(req: any, file: any, cb: (arg0: null, arg1: string) => void){
        cb(null, 'uploads/')
    },
    filename: function(req: any, file: { originalname: any }, cb: (arg0: null, arg1: any) => void){
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext);
    }
})
 
var upload = multer({
    storage: storage,
    fileFilter: function(req: any, file: { minetype: string }, callback: (arg0: null, arg1: boolean) => void){
        if(
            file.minetype == "text/csv"
        ){
            callback(null, true)
        } else{
            console.log("Error in uploading")
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})
 
module.exports = upload