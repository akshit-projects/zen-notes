const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Use a virtual `id` field that maps to `_id` for frontend compatibility
ProfileSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
ProfileSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Folder", ProfileSchema);
