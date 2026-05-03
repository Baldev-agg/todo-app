const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const Workspace = require("../models/Workspace");
const WorkspaceMember = require("../models/WorkspaceMember"); // 🛡️ Role check ke liye zaroori hai
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const authMiddleware = require("../middleware/authMiddleware");

// ─────────────────────────────────────────────────────────────────
// 🛡️ HELPER: Check if user has permission to modify tasks
// ─────────────────────────────────────────────────────────────────
const checkPermission = async (workspaceId, userId) => {
  if (!workspaceId) return true; // Dashboard tasks (personal) are always allowed

  const membership = await WorkspaceMember.findOne({
    workspaceId,
    userId,
    status: "Accepted",
  });

  // Viewer role cannot create, edit, or delete
  if (!membership || membership.role === "Viewer") {
    return false;
  }
  return true;
};

// 1. GET ALL TASKS (Main Dashboard)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const personalSpace = await Workspace.findOne({
      createdBy: userId,
      name: "Personal Space",
    });

    const query = {
      $or: [
        { createdBy: userId, workspaceId: { $exists: false } },
        { createdBy: userId, workspaceId: null },
      ],
    };
    if (personalSpace) query.$or.push({ workspaceId: personalSpace._id });

    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 2. GET TEAMSPACE TASKS
router.get("/:workspaceId", authMiddleware, async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const todos = await Todo.find({ workspaceId }).populate(
      "assigneeId",
      "name email",
    );
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 3. CREATE TASK (🛡️ Role Protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      text,
      description,
      status,
      priority,
      dueDate,
      workspaceId,
      assigneeEmail,
    } = req.body;
    const userId = req.userId;

    // 🛡️ BACKEND LOCK: Viewer check
    const hasPermission = await checkPermission(workspaceId, userId);
    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "Access denied. Viewers cannot create tasks." });
    }

    let targetAssigneeId = null;
    if (assigneeEmail) {
      const assignedUser = await User.findOne({ email: assigneeEmail });
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      if (assignedUser) targetAssigneeId = assignedUser._id;
      // ... Email logic ...
      await sendEmail({
        email: assignedUser.email,
        subject: "You have been assigned a new task!",
        message: `You have been assigned to a new task: "${text}".\nPriority: ${priority || "Medium"}\n\nPlease login to TaskMaster to view it.`,
        // inviteUrl: "http://localhost:5173/login"
        inviteUrl: `${frontendUrl}/login`,
      });
    }

    const newTodo = new Todo({
      text,
      description,
      status,
      priority,
      dueDate,
      workspaceId: workspaceId || null,
      createdBy: userId,
      assigneeId: targetAssigneeId,
    });

    await newTodo.save();
    const populatedTodo = await Todo.findById(newTodo._id).populate(
      "assigneeId",
      "name email",
    );
    res.status(201).json(populatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// 4. UPDATE TASK (🛡️ Role Protected)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Task not found" });

    // 🛡️ BACKEND LOCK: Viewer check
    const hasPermission = await checkPermission(todo.workspaceId, req.userId);
    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "Access denied. Viewers cannot edit tasks." });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    ).populate("assigneeId", "name email");

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// 5. DELETE TASK (🛡️ Role Protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Task not found" });

    // 🛡️ BACKEND LOCK: Viewer check
    const hasPermission = await checkPermission(todo.workspaceId, req.userId);
    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "Access denied. Viewers cannot delete tasks." });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;
