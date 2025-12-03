const UserRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const logger = require("../utils/logger");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/avatars"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

UserRouter.post("/", async (request, response, next) => {
  const { username, password, name } = request.body;

  if (!password) {
    return response.status(400).json({ error: "password must be  given" });
  }
  if (password.length <= 3) {
    return response
      .status(400)
      .json({ error: "password must be at least 3 characters long" });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username: username,
    passwordHash: passwordHash,
    name: name,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

UserRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });

  response.json(users);
});

UserRouter.get("/:id", async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id).populate({
      path: "blogs",
      select: "title imageUrl likes createdAt",
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    // Return only public info
    response.json({
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      blogs: user.blogs,
    });
  } catch (error) {
    next(error);
  }
});

UserRouter.delete("/:id", async (request, response) => {
  await User.findByIdAndDelete(request.params.id);
  response.status(204);
});

// controllers/user.js

UserRouter.put("/:id", async (req, res, next) => {
  try {
    const { bio } = req.body; // 1) get bio from request body

    // 2) update the user in Mongo
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { bio },
      { new: true } // return the updated doc, not the old one
    );

    // 3) send updated user back
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

UserRouter.put(
  "/:id/avatar",
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const filePath = req.file ? `/avatars/${req.file.filename}` : "";

      const updated = await User.findByIdAndUpdate(
        req.params.id,
        { avatarUrl: filePath },
        { new: true }
      );

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = UserRouter;
