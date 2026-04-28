// models/Workspace.js
const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" }, // Added for the UI column
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Workspace", workspaceSchema);