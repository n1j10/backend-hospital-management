const express = require("express");
const controller = require("../controllers/storage.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/health", controller.health);
router.post("/upload", express.raw({ type: () => true, limit: "10mb" }), controller.upload);
router.post("/upload-url", controller.uploadUrl);
router.get("/download-url", controller.downloadUrl);
router.delete("/", controller.remove);

module.exports = router;
