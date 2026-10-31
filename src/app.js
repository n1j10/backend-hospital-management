const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// Behind Vercel's proxy: needed so req.ip is the real client (rate limiting).
app.set("trust proxy", 1);

app.use(helmet());
// CORS_ORIGIN="https://a.com,https://b.com" restricts browsers to known frontends; unset = any origin.
// Auth uses a Bearer header (no cookies), so an open origin can't be abused for CSRF.
app.use(cors({ origin: config.corsOrigins.length ? config.corsOrigins : "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
if (config.env === "development") app.use(morgan("dev"));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
