const express = require('express');
const router = express.Router();

const Folder = require('../models/Folder');
const Note = require('../models/Note');

// --- Folder Routes ---

// GET all folders
router.get('/folders', async (req, res) => {
  try {
    const folders = await Folder.find().sort({ createdAt: 'asc' });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a folder
router.post('/folders', async (req, res) => {
  const folder = new Folder({
    name: req.body.name || 'New Folder',
  });
  try {
    const newFolder = await folder.save();
    res.status(201).json(newFolder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a folder
router.put('/folders/:id', async (req, res) => {
  try {
    const folder = await Folder.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    res.json(folder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a folder (and its notes)
router.delete('/folders/:id', async (req, res) => {
  try {
    const folder = await Folder.findByIdAndDelete(req.params.id);
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    
    // Also delete all notes in this folder
    await Note.deleteMany({ folderId: req.params.id });

    res.json({ message: 'Deleted Folder and its notes' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Note Routes ---

// GET all notes
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: 'asc' });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a note
router.post('/notes', async (req, res) => {
  const { title, folderId, content } = req.body;
  if (!folderId) {
      return res.status(400).json({ message: 'folderId is required' });
  }
  const note = new Note({
    title: title || 'New Note',
    folderId,
    content: content || ''
  });
  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a note (title or content)
router.put('/notes/:id', async (req, res) => {
  try {
    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.content !== undefined) updateData.content = req.body.content;

    const note = await Note.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a note
router.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Deleted Note' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
