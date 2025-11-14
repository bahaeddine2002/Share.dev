const router = require("express").Router();
const Notification = require("../models/notification");
const middleware = require("../utils/middleware");

// 🟩 Get all notifications for the logged-in user
router.get("/", middleware.userExtractor, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate("sender", "id name username avatarUrl")
      .populate("blog", "id title")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// 🟦 Mark one notification as read
router.put("/:id/read", middleware.userExtractor, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notif);
  } catch (error) {
    console.error("Error marking notification read:", error);
    res.status(400).json({ error: "Invalid ID" });
  }
});

module.exports = router;
