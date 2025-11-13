// migration.js - An example of a migration script

const mongoose = require("mongoose");
const config = require("./config");
const Blog = require("../models/blog");

console.log("Connecting to MongoDB...");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB.");
    runMigration();
  })
  .catch((err) => console.error("Could not connect to MongoDB:", err));

const runMigration = async () => {
  console.log("Starting migration for blogs collection...");

  try {
    // 1. Find all blogs where the 'likes' field is a Number.
    // The $type operator in MongoDB is perfect for this.
    const blogsToMigrate = await Blog.find({ likes: { $type: "number" } });

    if (blogsToMigrate.length === 0) {
      console.log("No blogs to migrate. Database is up to date.");
      mongoose.connection.close();
      return;
    }

    console.log(`Found ${blogsToMigrate.length} blogs to migrate.`);

    // 2. Loop through each one and update it.
    for (const blog of blogsToMigrate) {
      // The old value is a number. We can't know *who* liked it,
      // so the best we can do is set the new value to an empty array.
      blog.likes = [];
      await blog.save();
      console.log(`Migrated blog with ID: ${blog._id}`);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("An error occurred during migration:", error);
  } finally {
    // 3. Always close the database connection.
    mongoose.connection.close();
  }
};
