export function notFound(req, res) {
  res.status(404).json({ message: "The requested resource was not found." });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: "The request contains invalid data." });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "An account with that email already exists." });
  }
  console.error(error);
  res.status(500).json({ message: "Something went wrong. Please try again." });
}
