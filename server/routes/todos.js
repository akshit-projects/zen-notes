const router = require("./router");
const Todo = require("../models/Todo");

router.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    console.log(todos);
    return res.json(todos);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST a new todo
router.post("/todos", async (req, res) => {
  const { text, completed, date, list } = req.body;
  const todo = new Todo({ text, completed, date, list });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a todo
router.put("/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTodo)
      return res.status(404).json({ message: "Todo not found" });
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a todo
router.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
