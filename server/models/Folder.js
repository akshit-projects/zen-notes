const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use a virtual `id` field that maps to `_id` for frontend compatibility
FolderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
FolderSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Folder', FolderSchema);
