// backend/controllers/auth.js

const authRouter = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// ROUTE 1: The Initial Request
// This is the endpoint the user's browser hits when they click "Sign in with Google".
authRouter.get(
  "/google",

  passport.authenticate("google", {
    // We specify the 'google' strategy by name.
    scope: ["profile", "email"], // We ask Google for the user's profile and email.
    session: false, // We are using JWTs, not server sessions.
  })
);

// ROUTE 2: The Callback
// This is the endpoint that Google's servers will redirect the user to.
authRouter.get(
  "/google/callback",
  // This first middleware authenticates the user. It handles the secret code exchange
  // with Google and then runs our `strategyCallback` from Part 1.
  // If successful, it attaches the user to `request.user`.
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173", // Where to send the user if they cancel.
    session: false,
  }),

  // This second function ONLY RUNS if authentication was successful.
  (request, response) => {
    // SENIOR DEV NOTE: The flow converges here. Whether a user logged in
    // with a password or with Google, the end result is the same: we need
    // to give them a JWT cookie. This is good, consistent design.

    // `request.user` now contains the user object we found or created.
    const userForToken = {
      username: request.user.username,
      id: request.user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: "1h",
    });

    response.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    // Finally, redirect the user back to your React application.
    response.redirect("http://localhost:5173/");
  }
);

module.exports = authRouter;
