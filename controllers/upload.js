const upload = require("../middleware/upload");
const dbConfig = require("../config/config.json");
const mongoose = require("mongoose");
const config = require("../config/config.json");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = dbConfig.mongoUrl;

const baseUrl = "https://medical-be.vercel.app/api/upload/files/";

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {
    try {
        await upload(req, res);

        if (req.file == undefined) {
            return res.send({
                message: "You must select a file.",
            });
        }

        console.log(req.file)

        return res.send({
            message: "File has been uploaded.",
        });
    } catch (error) {
        console.log(error);

        return res.send({
            message: "Error when trying upload image: ${error}",
        });
    }
};

const getListFiles = async (req, res) => {
    try {
        await mongoose.connect(config.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const database = mongoClient.db('tattoo');
        const images = database.collection(dbConfig.imgBucket + '.files');
        const cursor = images.find({});
        let fileInfos = [];

        if ((await cursor.count()) === 0) {
            return res.status(500).send({
                message: "No files found!",
            });
        }


        await cursor.forEach((doc) => {
            fileInfos.push(doc)
        });

        return res.status(200).send(fileInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

// TODO do we need this one?
const download = async (req, res) => {
    try {
        await mongoose.connect(config.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const database = mongoClient.db('medicalApp');
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.imgBucket,
        });

        let downloadStream = bucket.openDownloadStreamByName(req.params.name);

        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            return res.status(404).send({ message: "Couldn't find file" });
        });

        downloadStream.on("end", () => {
            return res.end();
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

module.exports = {
    uploadFiles,
    getListFiles,
    download,
};
