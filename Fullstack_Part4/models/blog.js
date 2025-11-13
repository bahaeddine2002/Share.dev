const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    url: String,
    imageUrl: String,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // This tells Mongoose the IDs in this array refer to documents in the 'User' collection.
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
  },

  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (this.tags && Array.isArray(this.tags)) {
    this.tags = this.tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
  }
  next();
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
