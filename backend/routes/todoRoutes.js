const express = require("express");
const Todo = require("../models/Todo");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Get all todos
router.get("/", authMiddleware, async (req, res) => {
  const todos = await Todo.find({ userId: req.userId });
  res.json(todos);
});

// Create a new todo
router.post("/", authMiddleware, async (req, res) => {
  if (!req.body.text || req.body.text.trim().length === 0) {
    return res.status(400).json({ message: "Task text is required" });
  }
  
  const todo = await Todo.create({ text: req.body.text.trim(), completed: false, userId: req.userId });
  res.status(201).json(todo);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed !== undefined ? req.body.completed : true },
    { new: true }
  );
  
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  
  res.json(todo);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  
  res.json({ message: "Todo deleted successfully", todo });
});

// Export the router
module.exports = router;
