const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  description: { type: String, default: "" }, 
  status: { type: String, default: "Not started" },
  completed: { type: Boolean, default: false },
  workspaceId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: false, // <-- ISKO FALSE KARO ya hata do
    default: null    // Dashboard tasks ke liye null allow karega
  },
  assigneeId: { 
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
  createdAt:{ type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model("Todo", TodoSchema);