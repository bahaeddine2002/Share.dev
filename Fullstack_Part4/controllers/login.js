const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const loginRouter = require("express").Router();
const User = require("../models/user");
const middleware = require("../utils/middleware");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;
  console.log(request.body);

  const user = await User.findOne({ username: username });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: "1h" });

  response.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  response.status(200).json(user);
});

loginRouter.post("/logout", (request, response) => {
  response.clearCookie("token");
  return response.status(204).send(); // 204 No Content is appropriate here
});

loginRouter.get("/status", middleware.userExtractor, (request, response) => {
  const user = request.user;

  response.status(200).json(user);
});

module.exports = loginRouter;
