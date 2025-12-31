const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  profileId: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  date: { type: String, default: null }, // YYYY-MM-DD format
  list: { type: String, default: null },
});

todoSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

todoSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Todo", todoSchema);
