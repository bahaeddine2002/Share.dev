const { error } = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const errorHandling = (error, request, response, next) => {
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  } else if (error.name === "CastError") {
    return response.status(400).json({ error: "invalid id" });
  }
  console.log(error);
  next();
};

const userExtractor = async (request, response, next) => {
  const token = request.cookies.token;

  if (!token) {
    return response.status(401).json({ error: "token missing" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id);
    console.log(user);
    if (!user) {
      return response.status(401).json({ error: "user not found" });
    }

    request.user = user;
  } catch (error) {
    return response.status(401).json({ error: "token invalid or expired" });
  }

  next();
};

module.exports = { errorHandling, userExtractor };
