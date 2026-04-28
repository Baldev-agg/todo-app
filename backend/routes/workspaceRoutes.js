// backend/routes/workspaceRoutes.js
const express = require("express");
const router = express.Router();
const Workspace = require("../models/Workspace");
const WorkspaceMember = require("../models/WorkspaceMember");
const User = require("../models/User"); // To fetch user email for membership record
const authMiddleware = require("../middleware/authMiddleware");
const crypto = require('crypto'); // Token generate karne ke liye
const sendEmail = require('../utils/sendEmail');

// 1. Create a new Workspace (Teamspace)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body; 

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    // Step 1: Create the workspace
    const newWorkspace = new Workspace({
      name,
      description: description || "",
      createdBy: req.userId, // ID of the user creating it
    });
    
    await newWorkspace.save();

    // Fetch user email to store in the member record
    const user = await User.findById(req.userId);

    // Step 2: Automatically make the creator the "Owner" of this workspace
    const newMember = new WorkspaceMember({
      workspaceId: newWorkspace._id,
      userId: req.userId,
      email: user.email,
      role: "Owner",
      status: "Accepted", // Automatically accepted since they created it
    });

    await newMember.save();

    res.status(201).json({ 
        message: "Workspace created successfully", 
        workspace: newWorkspace 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error creating workspace" });
  }
});

// 2. Get all Workspaces for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Step 1: Find all memberships for this user where status is 'Accepted'
    const memberships = await WorkspaceMember.find({ 
        userId: req.userId, 
        status: "Accepted" 
    }).populate("workspaceId"); // This pulls the actual workspace details

    // Step 2: Format the data cleanly for the frontend
    const workspaces = memberships.map(member => {
        return {
            _id: member.workspaceId._id,
            name: member.workspaceId.name,
            description: member.workspaceId.description,
            myRole: member.role, // Important: Frontend needs to know if they are Owner, Admin, etc.
            createdAt: member.workspaceId.createdAt
        }
    });

    res.status(200).json(workspaces);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error fetching workspaces" });
  }
});

// 3. Send Invite to Workspace (POST)
router.post("/:workspaceId/invite", authMiddleware, async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;
    const userId = req.userId;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and Role are required" });
    }

    // Step 1: Check if the user sending the invite is an Owner or Admin
    // (Yahan thoda sa RBAC start ho gaya hai!)
    const inviterMembership = await WorkspaceMember.findOne({
      workspaceId: workspaceId,
      userId: userId,
      status: "Accepted"
    });

    if (!inviterMembership || (inviterMembership.role !== 'Owner' && inviterMembership.role !== 'Admin')) {
      return res.status(403).json({ message: "Only Owners or Admins can invite people" });
    }

    // Step 2: Check if user is already invited or a member
    const existingMember = await WorkspaceMember.findOne({ workspaceId, email });
    if (existingMember) {
       return res.status(400).json({ message: "User is already a member or has a pending invite" });
    }

    // Step 3: Generate a secure random token
    const inviteToken = crypto.randomBytes(20).toString('hex');

    // Step 4: Save the pending member to DB
    const pendingMember = new WorkspaceMember({
      workspaceId: workspaceId,
      email: email,
      role: role,
      status: "Pending",
      inviteToken: inviteToken
    });
    await pendingMember.save();

    // Step 5: Send the Email
    // Frontend par ek route banana hoga /invite/accept?token=XYZ
    // const inviteUrl = `http://localhost:5173/invite/accept?token=${inviteToken}`; 
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const inviteUrl = `${frontendUrl}/invite/accept?token=${inviteToken}`;
    const message = `You have been invited to join a Workspace on TaskMaster as a ${role}. Click the button below to accept.`;

    await sendEmail({
      email: email,
      subject: "Invitation to join TaskMaster Workspace",
      message: message,
      inviteUrl: inviteUrl
    });

    res.status(200).json({ message: "Invitation sent successfully!" });

  } catch (error) {
    console.error("Error sending invite:", error);
    res.status(500).json({ message: "Server Error sending invitation" });
  }
});


// 4. Accept Workspace Invite (POST)
router.post("/accept-invite/:token", authMiddleware, async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.userId;

    // Step 1: Find the pending invite using the token
    const pendingMember = await WorkspaceMember.findOne({
      inviteToken: token,
      status: "Pending"
    });

    if (!pendingMember) {
      return res.status(400).json({ message: "Invalid or expired invitation token" });
    }

    // Fetch user to confirm email matches
    const user = await User.findById(userId);
    if(user.email !== pendingMember.email){
        return res.status(400).json({ message: "Please log in with the email address that received the invite."});
    }

    // Step 2: Update status to Accepted and link userId
    pendingMember.status = "Accepted";
    pendingMember.userId = userId;
    pendingMember.inviteToken = undefined; // Clear token after use
    pendingMember.joinedAt = Date.now();
    await pendingMember.save();

    res.status(200).json({ message: "Invitation accepted! You are now part of the workspace." });

  } catch (error) {
    console.error("Error accepting invite:", error);
    res.status(500).json({ message: "Server Error accepting invitation" });
  }
});

module.exports = router;