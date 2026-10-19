const storageService = require("../services/storage.service");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const health = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, await storageService.checkConnection());
});

// Raw body upload: Content-Type = file mime, ?filename=x.pdf&folder=patients
const upload = asyncHandler(async (req, res) => {
  const file = await storageService.uploadBuffer({
    buffer: Buffer.isBuffer(req.body) ? req.body : null,
    contentType: req.headers["content-type"] || "application/octet-stream",
    folder: req.query.folder,
    filename: req.query.filename,
  });
  sendSuccess(res, 201, file, "File uploaded");
});

const uploadUrl = asyncHandler(async (req, res) => {
  const { folder, filename, contentType } = req.body;
  sendSuccess(res, 200, await storageService.getUploadUrl({ folder, filename, contentType }));
});

const downloadUrl = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, await storageService.getDownloadUrl(req.query.key));
});

const remove = asyncHandler(async (req, res) => {
  await storageService.deleteFile(req.query.key);
  sendSuccess(res, 200, null, "File deleted");
});

module.exports = { health, upload, uploadUrl, downloadUrl, remove };
