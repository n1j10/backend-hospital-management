const test = require("node:test");
const assert = require("node:assert/strict");
const rateLimit = require("../src/middlewares/rateLimit.middleware");

const run = (limiter, ip = "1.1.1.1") => {
  const headers = {};
  let error;
  limiter({ ip }, { setHeader: (k, v) => (headers[k] = v) }, (err) => (error = err));
  return { error, headers };
};

test("rateLimit: blocks after max requests in the window", () => {
  const limiter = rateLimit({ windowMs: 60_000, max: 2 });

  assert.equal(run(limiter).error, undefined);
  assert.equal(run(limiter).error, undefined);
  const third = run(limiter);
  assert.equal(third.error.statusCode, 429);
  assert.ok(third.headers["Retry-After"] > 0);
});

test("rateLimit: counts each IP separately", () => {
  const limiter = rateLimit({ windowMs: 60_000, max: 1 });

  assert.equal(run(limiter, "1.1.1.1").error, undefined);
  assert.equal(run(limiter, "2.2.2.2").error, undefined);
  assert.equal(run(limiter, "1.1.1.1").error.statusCode, 429);
});
