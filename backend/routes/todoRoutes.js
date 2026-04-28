const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const Workspace = require("../models/Workspace");
const User = require("../models/User"); // ADD THIS
const sendEmail = require("../utils/sendEmail"); // ADD THIS
const authMiddleware = require("../middleware/authMiddleware");

// 1. GET ALL TASKS (For Main Dashboard - Personal Space)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || req.userId;
    
    // User ka Personal Space dhundo
    const personalSpace = await Workspace.findOne({ 
      createdBy: userId, 
      name: "Personal Space" 
    });

    if (!personalSpace) {
      return res.status(200).json([]); // Agar nahi hai toh khali list bhej do
    }

    // Personal space ke tasks bhej do (Yehi tumhare purane migrate kiye hue tasks hain!)
    const todos = await Todo.find({ workspaceId: personalSpace._id });
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching personal todos:", error);
    res.status(500).json({ message: "Server error fetching todos" });
  }
});

// 2. GET TEAMSPACE TASKS (For Teamspace Detail Page)
router.get("/:workspaceId", authMiddleware, async (req, res) => {
  try {
    const { workspaceId } = req.params;
    // .populate() se hume user ka name aur email mil jayega
    const todos = await Todo.find({ workspaceId: workspaceId }).populate("assigneeId", "name email");
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching team todos" });
  }
});

// 3. CREATE TASK (Smart Route - Handles both Dashboard & Teamspace)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text, description, status, priority, dueDate, workspaceId, assigneeEmail } = req.body;
    let targetAssigneeId = null;

    // Agar email aaya hai, toh pehle user ko DB mein dhundo
    if (assigneeEmail) {
      const assignedUser = await User.findOne({ email: assigneeEmail });
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      if (assignedUser) {
        targetAssigneeId = assignedUser._id;
        
        // EMAIL BHEJO!
        await sendEmail({
          email: assignedUser.email,
          subject: "You have been assigned a new task!",
          message: `You have been assigned to a new task: "${text}".\nPriority: ${priority || 'Medium'}\n\nPlease login to TaskMaster to view it.`,
          // inviteUrl: "http://localhost:5173/login" 
          inviteUrl: `${frontendUrl}/login`
        });
      }
    }

    const newTodo = new Todo({
      text,
      description,
      status: status || "Not started",
      completed: status === "Done",
      priority: priority || "Medium",
      dueDate: dueDate || null,
      workspaceId: workspaceId,
      assigneeId: targetAssigneeId
    });

    await newTodo.save();
    // Return populated todo so frontend gets the name immediately
    const populatedTodo = await Todo.findById(newTodo._id).populate("assigneeId", "name email");
    res.status(201).json(populatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error creating todo" });
  }
});

// 4. UPDATE TASK (Toggle Complete)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { text, description, status, priority, dueDate, assigneeEmail } = req.body;
    let targetAssigneeId = undefined; // undefined means don't update if not passed

    // Agar edit karte waqt naya email dala hai
    if (assigneeEmail) {
      const assignedUser = await User.findOne({ email: assigneeEmail });
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      if (assignedUser) {
        targetAssigneeId = assignedUser._id;
        
        // Naye bande ko mail bhej do
        await sendEmail({
          email: assignedUser.email,
          subject: "A task has been assigned to you",
          message: `Task Updated and Assigned to you: "${text}".`,
          // inviteUrl: "http://localhost:5173/login"
          inviteUrl: `${frontendUrl}/login`
        });
      }
    }

    const updateData = {
      text, description, status, priority,
      completed: status === "Done",
      dueDate: dueDate || null
    };
    
    if (targetAssigneeId !== undefined) {
      updateData.assigneeId = targetAssigneeId;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate("assigneeId", "name email");
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error updating todo" });
  }
});

// 5. DELETE TASK
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Server error deleting todo" });
  }
});

module.exports = router;

