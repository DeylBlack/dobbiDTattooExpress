const express = require("express");
const router = express.Router();
const uploadViewController = require("../controllers/upload-view");
const uploadController = require("../controllers/upload");

// TODO remove
router.get("/view", uploadViewController.getHome);

router.post("/upload", uploadController.uploadFiles);
router.get("/files", uploadController.getListFiles);
router.get("/files/:name", uploadController.download);

module.exports = router;
