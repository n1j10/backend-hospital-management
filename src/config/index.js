require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL,
  corsOrigins: (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  // Staff sign-up from the public internet. Set to "false" once the staff accounts exist:
  // after that only an ADMIN should create users.
  allowSelfRegistration: process.env.ALLOW_SELF_REGISTRATION !== "false",
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  storage: {
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    region: process.env.AWS_REGION || "us-east-1",
    bucket: process.env.AWS_BUCKET || "default-bucket",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const required = [
  "DATABASE_URL",
  "JWT_SECRET",
  "AWS_ENDPOINT_URL_S3",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(", ")}`);
}

// A short HMAC secret can be brute-forced offline from any issued token.
if (config.env === "production" && process.env.JWT_SECRET.length < 32) {
  console.warn("JWT_SECRET is shorter than 32 characters: use a long random value in production");
}

module.exports = config;
