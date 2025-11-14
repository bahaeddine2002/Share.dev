const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");
const logger = require("../utils/logger");
const Comment = require("../models/comments");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Notification = require("../models/notification");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .populate("comments", { content: 1 })
    .populate("likes", { username: 1, name: 1 }) // populate liked users too
    .sort({ createdAt: -1 });

  response.json(blogs);
});

// backend/controllers/blogs.js

blogsRouter.get("/trending", async (request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  // The enhanced aggregation pipeline
  const trendingBlogs = await Blog.aggregate([
    { $addFields: { likeCount: { $size: "$likes" } } },
    { $sort: { likeCount: -1, createdAt: -1 } }, // Sort by likes, then by creation date
    { $skip: skip },
    { $limit: limit },
    // --- Populate Author ---
    {
      $lookup: {
        from: "users", // The actual name of the users collection in MongoDB
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    // --- Populate Comments ---
    {
      $lookup: {
        from: "comments", // The actual name of the comments collection
        localField: "comments",
        foreignField: "_id",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "likes",
        foreignField: "_id",
        as: "likedBy",
      },
    },
    // --- Reshape the final output for the frontend ---
    {
      $project: {
        id: "$_id", // Rename _id to id
        _id: 0, // Exclude the old _id field
        title: 1,
        url: 1,
        likes: 1,
        imageUrl: 1,
        createdAt: 1,
        author: "$user.name", // Keep the simple author string for the BlogCard
        // Also provide the full user object for the detail page's permission checks
        user: {
          id: "$user._id",
          username: "$user.username",
          name: "$user.name",
        },
        // Reshape the comments to be clean objects with an 'id'
        comments: {
          $map: {
            input: "$comments",
            as: "comment",
            in: { id: "$$comment._id", content: "$$comment.content" },
          },
        },
        likes: {
          $map: {
            input: "$likedBy",
            as: "u",
            in: { id: "$$u._id", username: "$$u.username", name: "$$u.name" },
          },
        },
      },
    },
  ]);

  const totalBlogs = await Blog.countDocuments();

  response.json({
    blogs: trendingBlogs,
    totalPages: Math.ceil(totalBlogs / limit),
    currentPage: page,
  });
});

blogsRouter.get("/feed", middleware.userExtractor, async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      console.log("❌ No user found in req.user");
      return res.status(401).json({ error: "Unauthorized" });
    }

    logger.info("✅ Current user ID:", currentUser.id);
    logger.info("📦 Following array:", currentUser.following);

    const followingIds = currentUser.following || [];

    if (followingIds.length === 0) {
      console.log("ℹ️ No following users found.");
      return res.json({
        blogs: [],
        message: "You are not following anyone yet.",
      });
    }

    // Convert all to ObjectId explicitly before querying
    const objectIds = followingIds.map((id) => {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (e) {
        console.error("❌ Invalid ObjectId:", id);
        throw e;
      }
    });

    console.log("🧠 Converted IDs:", objectIds);

    const feedBlogs = await Blog.find({ user: { $in: objectIds } })
      .populate("user", { username: 1, name: 1 })
      .populate("comments", { content: 1 })
      .populate("likes", { username: 1, name: 1 })
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${feedBlogs.length} blogs in feed.`);

    res.json(feedBlogs);
  } catch (error) {
    console.error("🔥 Feed error:", error);
    res.status(400).json({ error: "invalid id or bad request" });
  }
});

blogsRouter.get("/:id", async (request, response) => {
  const result = await Blog.findById(request.params.id)
    .populate("user", {
      username: 1,
      name: 1,
    })
    .populate("comments", {
      content: 1,
    });
  if (!result) {
    return response.status(404).json({ error: `blog dosn't exist` });
  }
  response.json(result);
});

blogsRouter.get("/tags/:tag", async (req, res) => {
  const tag = req.params.tag.toLowerCase();
  const blogs = await Blog.find({ tags: { $in: [tag] } })
    .populate("user", { username: 1, name: 1 })
    .populate("comments", { content: 1 })
    .sort({ createdAt: -1 });

  res.json(blogs);
});

blogsRouter.post(
  "/",
  middleware.userExtractor,
  upload.single("image"),
  async (request, response) => {
    const body = request.body;
    const user = request.user;

    if (!body.url || !body.title) {
      return response.status(400).end();
    }

    let tags = [];
    if (body.tags) {
      tags = body.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: [],
      user: user._id,
      imageUrl: request.file ? request.file.path : null,
      tags: body.tags
        ? body.tags.split(",").map((t) => t.trim().toLowerCase())
        : [],
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    const result = await savedBlog.populate("user", { username: 1, name: 1 });

    response.status(201).json(result);
  }
);

blogsRouter.post(
  "/:id/comments",
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: `blog dosn't exist` });
    }
    const body = request.body;
    logger.info(body);

    const comment = new Comment({
      content: body.content,
    });

    const savedComment = await comment.save();
    const Notification = require("../models/notification");

    blog.comments = blog.comments.concat(savedComment._id);
    const savedBlog = await blog.save();

    const result = await savedBlog.populate([
      { path: "user", select: "username name" },
      { path: "comments", select: "content" },
    ]);

    // Create a notification for the blog owner
    if (blog.user.toString() !== request.user.id) {
      await Notification.create({
        recipient: blog.user,
        sender: request.user.id,
        type: "comment",
        blog: blog._id,
      });
    }

    response.status(201).json(savedBlog);
  }
);

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    console.log(request);
    console.log("baha");
    const blog = await Blog.findById(request.params.id);
    const user = request.user;
    console.log(user);

    if (blog && user) {
      if (user._id.toString() !== blog.user.toString()) {
        return response
          .status(401)
          .json({ error: "only the owner of the blog can delte it" });
      }
      const result = await Blog.findByIdAndDelete(request.params.id);
    }

    response.status(204).end();
  }
);

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).end;
  }

  blog.title = body.title || blog.title;
  blog.author = body.author || blog.author;
  blog.url = body.url || blog.url;
  blog.likes = body.likes || blog.likes;

  const updatedBlog = await blog.save();
  const result = await updatedBlog.populate([
    { path: "user", select: "username name" },
    { path: "comments", select: "content" },
  ]);
  response.json(result);
});

blogsRouter.put(
  "/:id/like",
  middleware.userExtractor,
  async (request, response) => {
    // Lesson: The user's identity comes from the cookie via our trusted middleware,
    // NOT from the request body. This is a critical security practice.
    const user = request.user;

    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).json({ error: "Blog post not found" });
    }

    const userIdAsString = user._id.toString();

    const alreadyLiked = blog.likes.some(
      (likerId) => likerId.toString() === userIdAsString
    );

    if (alreadyLiked) {
      blog.likes.pull(user._id);
    } else {
      blog.likes.push(user._id);
    }

    const savedBlog = await blog.save();

    await savedBlog.populate("user", { username: 1, name: 1, id: 1 });
    await savedBlog.populate("comments", { content: 1, id: 1 });
    await savedBlog.populate("likes", { username: 1, name: 1, id: 1 });

    if (blog.user.toString() !== request.user.id) {
      await Notification.create({
        recipient: blog.user,
        sender: request.user.id,
        type: "like",
        blog: blog._id,
      });
    }

    response.json(savedBlog);
  }
);

module.exports = blogsRouter;
