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
  const todo = await Todo.create({ text: req.body.text, completed: false, userId: req.userId });
  res.json(todo);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: true },
    { new: true },
    { userId: req.userId }
  );
  res.json(todo);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id, { userId: req.userId });
  res.json(todo);
});

// Export the router
module.exports = router;
