const { S3Client } = require("@aws-sdk/client-s3");
const config = require("./index");

// Neon object storage is S3-compatible; path-style addressing is required.
const s3 = new S3Client({
  endpoint: config.storage.endpoint,
  region: config.storage.region,
  forcePathStyle: true,
  credentials: {
    accessKeyId: config.storage.accessKeyId,
    secretAccessKey: config.storage.secretAccessKey,
  },
});

module.exports = { s3, bucket: config.storage.bucket };
