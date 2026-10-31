const crypto = require("crypto");
const path = require("path");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3, bucket } = require("../config/storage");
const ApiError = require("../utils/ApiError");

const URL_TTL_SECONDS = 15 * 60;

// Files are opened straight from the bucket, so active content (HTML, SVG, JS)
// would run in the browser of whoever opens it: only documents and raster images are allowed.
const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

const assertContentType = (contentType) => {
  const type = String(contentType || "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_CONTENT_TYPES.includes(type)) {
    throw ApiError.badRequest(`File type not allowed. Allowed: ${ALLOWED_CONTENT_TYPES.join(", ")}`);
  }
  return type;
};

// "patients/2026/<uuid>.pdf" - never trust the client's filename as the key.
const buildKey = (folder, filename) => {
  const safeFolder = (folder || "uploads").replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "");
  const ext = path.extname(filename || "").toLowerCase().replace(/[^.a-z0-9]/g, "");
  return `${safeFolder || "uploads"}/${crypto.randomUUID()}${ext}`;
};

const assertKey = (key) => {
  if (!key || typeof key !== "string" || key.length > 512 || key.includes("..") || key.startsWith("/")) {
    throw ApiError.badRequest("Invalid file key");
  }
};

const uploadBuffer = async ({ buffer, contentType, folder, filename }) => {
  if (!buffer || !buffer.length) throw ApiError.badRequest("File is empty");
  const type = assertContentType(contentType);
  const key = buildKey(folder, filename);
  await s3.send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: type })
  );
  return { key, size: buffer.length, contentType: type };
};

const getUploadUrl = async ({ folder, filename, contentType }) => {
  const type = assertContentType(contentType);
  const key = buildKey(folder, filename);
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: type }),
    { expiresIn: URL_TTL_SECONDS }
  );
  return { key, url, expiresIn: URL_TTL_SECONDS };
};

const getDownloadUrl = async (key) => {
  assertKey(key);
  const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), {
    expiresIn: URL_TTL_SECONDS,
  });
  return { key, url, expiresIn: URL_TTL_SECONDS };
};

const deleteFile = async (key) => {
  assertKey(key);
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};

const checkConnection = async () => {
  await s3.send(new HeadBucketCommand({ Bucket: bucket }));
  return { bucket, connected: true };
};

module.exports = { uploadBuffer, getUploadUrl, getDownloadUrl, deleteFile, checkConnection };
