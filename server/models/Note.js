const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use a virtual `id` field that maps to `_id` for frontend compatibility
NoteSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
NoteSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Note', NoteSchema);
