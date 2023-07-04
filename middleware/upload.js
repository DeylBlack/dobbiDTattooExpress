const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/config.json");

let storage = new GridFsStorage({
    url: dbConfig.mongoUrl,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${req.body.user}-medical-${Date.now()}-${file.originalname}`;
            return {
                filename: filename,
                user: `${req.body.user}`
            };
        }

        return {
            bucketName: dbConfig.imgBucket,
            filename: `${req.body.user}-medical-${Date.now()}-${file.originalname}`,
            user: `${req.body.user}`
        };
    }
});

let uploadFiles = multer({ storage: storage }).single("file");
let uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;
