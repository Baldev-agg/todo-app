// // models/Todo.js (UPDATED)
// const mongoose = require("mongoose");

// const TodoSchema = new mongoose.Schema({
//   text: String,
//   completed: Boolean,
//   workspaceId: { // <-- CHANGED from userId
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Workspace",
//     required: true,
//   },
//   assigneeId: { // <-- NEW: Who is working on this?
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     default: null
//   },
//   priority:{
//     type: String,
//     enum: ['Low', 'Medium', 'High'],
//     default: 'Medium'
//   },
//   dueDate: { type: Date, default: null },
//   createdAt:{ type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Todo", TodoSchema);

const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  description: { type: String, default: "" }, 
  status: { type: String, default: "Not started" },
  completed: { type: Boolean, default: false },
  workspaceId: { // <-- Yeh Zaroori Hai
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  assigneeId: { // <-- Naya team feature
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  priority:{
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: { type: Date, default: null },
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model("Todo", TodoSchema);