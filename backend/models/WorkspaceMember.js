// models/WorkspaceMember.js
const mongoose = require("mongoose");

const workspaceMemberSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Null if invite sent to non-existing user
  email: { type: String, required: true }, // Store email for pending invites
  role: { 
    type: String, 
    enum: ['Owner', 'Admin', 'Member', 'Viewer'], 
    default: 'Member' 
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted'],
    default: 'Pending'
  },
  inviteToken: { type: String }, // Token sent in the email link
  joinedAt: { type: Date }
});

module.exports = mongoose.model("WorkspaceMember", workspaceMemberSchema);