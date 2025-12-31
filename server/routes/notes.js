const router = require("./router");
const Note = require("../models/Note");

// GET all notes
router.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: "asc" });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a note
router.post("/notes", async (req, res) => {
  const { title, folderId, content } = req.body;
  if (!folderId) {
    return res.status(400).json({ message: "folderId is required" });
  }
  const note = new Note({
    title: title || "New Note",
    folderId,
    content: content || "",
  });
  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a note (title or content)
router.put("/notes/:id", async (req, res) => {
  try {
    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.content !== undefined) updateData.content = req.body.content;

    const note = await Note.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a note
router.delete("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Deleted Note" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
