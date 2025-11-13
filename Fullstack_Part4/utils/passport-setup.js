const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

const strategyCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      console.log("Existing user found:", existingUser);
      return done(null, existingUser);
    }

    console.log("Creating a new user from Google profile.");
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,

      username:
        profile.displayName.replace(/\s/g, "").toLowerCase() +
        Math.floor(Math.random() * 10000),
    });

    await newUser.save();

    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL: "http://localhost:3003/api/auth/google/callback",
    },
    strategyCallback
  )
);
