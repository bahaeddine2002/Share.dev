const router = require("express").Router();
const User = require("../models/user");
const middleware = require("../utils/middleware");
const mongoose = require("mongoose");
const Notification = require("../models/notification");

// 🔹 Follow a user
router.post("/:id/follow", middleware.userExtractor, async (req, res) => {
  const followerId = req.user.id;
  const targetId = req.params.id;

  if (followerId === targetId)
    return res.status(400).json({ error: "You cannot follow yourself." });

  const follower = await User.findById(followerId);
  const target = await User.findById(targetId);

  if (!target) return res.status(404).json({ error: "User not found" });

  const followerObjId = new mongoose.Types.ObjectId(followerId);
  const targetObjId = new mongoose.Types.ObjectId(targetId);

  if (!target.followers.some((id) => id.equals(followerObjId))) {
    target.followers.push(followerObjId);
    await target.save();
  }

  if (!follower.following.some((id) => id.equals(targetObjId))) {
    follower.following.push(targetObjId);
    await follower.save();
  }

  // 🧩 Return the updated target user with populated followers/following
  const updatedTarget = await User.findById(targetId)
    .populate("followers", "id username name")
    .populate("following", "id username name");

  await Notification.create({
    recipient: target._id,
    sender: follower._id,
    type: "follow",
  });

  res.json(updatedTarget);
});

// 🔹 Unfollow a user
router.delete("/:id/follow", middleware.userExtractor, async (req, res) => {
  const followerId = req.user.id;
  const targetId = req.params.id;

  const follower = await User.findById(followerId);
  const target = await User.findById(targetId);
  if (!target) return res.status(404).json({ error: "User not found" });

  target.followers = target.followers.filter(
    (id) => id.toString() !== followerId
  );
  follower.following = follower.following.filter(
    (id) => id.toString() !== targetId
  );

  await target.save();
  await follower.save();

  // 🧩 Return updated user (target)
  const updatedTarget = await User.findById(targetId)
    .populate("followers", "id username name")
    .populate("following", "id username name");

  res.json(updatedTarget);
});

module.exports = router;
