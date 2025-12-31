const router = require("./router");
const Folder = require("../models/Folder");

// GET all folders
router.get("/folders", async (req, res) => {
  try {
    const folders = await Folder.find().sort({ createdAt: "asc" });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a folder
router.post("/folders", async (req, res) => {
  console.log(req.body);
  const folder = new Folder({
    name: req.body.name || "New Folder",
    userId: req.user.id,
    profileId: req.body.profileId,
  });
  try {
    const newFolder = await folder.save();
    res.status(201).json(newFolder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a folder
router.put("/folders/:id", async (req, res) => {
  try {
    const folder = await Folder.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        profileId: req.body.profileId,
      },
      { new: true }
    );
    if (!folder) return res.status(404).json({ message: "Folder not found" });
    res.json(folder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a folder (and its notes)
router.delete("/folders/:id", async (req, res) => {
  try {
    const folder = await Folder.findByIdAndDelete(req.params.id);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    // Also delete all notes in this folder
    await Note.deleteMany({ folderId: req.params.id });

    res.json({ message: "Deleted Folder and its notes" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
