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

// "patients/2026/<uuid>.pdf" - never trust the client's filename as the key.
const buildKey = (folder, filename) => {
  const safeFolder = (folder || "uploads").replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "");
  const ext = path.extname(filename || "").toLowerCase().replace(/[^.a-z0-9]/g, "");
  return `${safeFolder || "uploads"}/${crypto.randomUUID()}${ext}`;
};

const assertKey = (key) => {
  if (!key || typeof key !== "string" || key.includes("..")) {
    throw ApiError.badRequest("Invalid file key");
  }
};

const uploadBuffer = async ({ buffer, contentType, folder, filename }) => {
  if (!buffer || !buffer.length) throw ApiError.badRequest("File is empty");
  const key = buildKey(folder, filename);
  await s3.send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType })
  );
  return { key, size: buffer.length, contentType };
};

const getUploadUrl = async ({ folder, filename, contentType }) => {
  const key = buildKey(folder, filename);
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
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
