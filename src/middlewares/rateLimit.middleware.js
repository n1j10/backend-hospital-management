const ApiError = require("../utils/ApiError");

// Fixed-window limiter keyed by client IP, no extra dependency.
// On serverless each instance keeps its own window, so this is a brake on
// brute force / credential stuffing, not a global quota.
const rateLimit = ({ windowMs, max, message = "Too many requests, please try again later" }) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    let entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;

    // drop expired entries so the map can't grow without bound
    if (hits.size > 10_000) {
      for (const [ip, value] of hits) if (value.resetAt <= now) hits.delete(ip);
    }

    res.setHeader("RateLimit-Limit", max);
    res.setHeader("RateLimit-Remaining", Math.max(0, max - entry.count));
    res.setHeader("RateLimit-Reset", Math.ceil((entry.resetAt - now) / 1000));

    if (entry.count > max) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      return next(new ApiError(429, message));
    }
    next();
  };
};

module.exports = rateLimit;
