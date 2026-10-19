const ApiError = require("../utils/ApiError");

// Zod equivalent of validateFuctionSchema(): validates one request part.
const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const messages = result.error.issues.map((issue) =>
      issue.path.length ? `${issue.path.join(".")}: ${issue.message}` : issue.message,
    );
    return next(ApiError.badRequest(messages.join(", ")));
  }

  req[source] = result.data;
  next();
};

module.exports = validate;
