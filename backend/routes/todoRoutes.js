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
  
  const todoData = {
    text: req.body.text.trim(),
    completed: false,
    userId: req.userId,
    priority: req.body.priority || 'Medium',
    dueDate: req.body.dueDate || null
  };
  
  const todo = await Todo.create(todoData);
  res.status(201).json(todo);
});
// Update a todo
router.put("/:id", authMiddleware, async (req, res) => {
  const updateData = {};
  
  // Update text if provided
  if (req.body.text !== undefined) {
    if (req.body.text.trim().length === 0) {
      return res.status(400).json({ message: "Task text cannot be empty" });
    }
    updateData.text = req.body.text.trim();
  }
  
  // Update completed if provided
  if (req.body.completed !== undefined) {
    updateData.completed = req.body.completed;
  }
  
  // Update priority if provided
  if (req.body.priority !== undefined) {
    updateData.priority = req.body.priority;
  }
  
  // Update dueDate if provided
  if (req.body.dueDate !== undefined) {
    updateData.dueDate = req.body.dueDate;
  }
  
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );
  
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  
  res.json(todo);
});
// Delete a todo
router.delete("/:id", authMiddleware, async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  
  res.json({ message: "Todo deleted successfully", todo });
});

// Export the router
module.exports = router;
