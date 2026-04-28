// backend/migrateData.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Todo = require('./models/Todo');
const Workspace = require('./models/Workspace');
const WorkspaceMember = require('./models/WorkspaceMember');

const migrate = async () => {
  try {
    // 1. Connect to Database (apna URI check kar lena)
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app');
    console.log("Connected to MongoDB for Migration...");

    // 2. Get all users
    const users = await User.find();
    console.log(`Found ${users.length} users. Starting migration...`);

    for (let user of users) {
      // 3. Check if user already has a Personal Workspace
      let personalWorkspace = await Workspace.findOne({ 
        createdBy: user._id, 
        name: "Personal Space" 
      });

      if (!personalWorkspace) {
        // Create new Personal Workspace
        personalWorkspace = new Workspace({
          name: "Personal Space",
          description: "Your private tasks",
          createdBy: user._id
        });
        await personalWorkspace.save();

        // Make user the Owner
        const newMember = new WorkspaceMember({
          workspaceId: personalWorkspace._id,
          userId: user._id,
          email: user.email,
          role: "Owner",
          status: "Accepted"
        });
        await newMember.save();
        console.log(`Created Personal Space for: ${user.email}`);
      }

      // 4. Find all tasks belonging to this user that DON'T have a workspaceId yet
      // Hum strict mode off karke check kar rahe hain kyunki purane docs mein field nahi thi
      const userTasks = await mongoose.connection.db.collection('todos').find({ 
        userId: user._id,
        workspaceId: { $exists: false } 
      }).toArray();

      if (userTasks.length > 0) {
        console.log(`Moving ${userTasks.length} tasks for ${user.email}...`);
        
        // 5. Update each task
        for (let task of userTasks) {
          await mongoose.connection.db.collection('todos').updateOne(
            { _id: task._id },
            { 
              $set: { workspaceId: personalWorkspace._id },
              $unset: { userId: "" } // Purana userId hata do
            }
          );
        }
      }
    }

    console.log("Migration Completed Successfully! 🎉");
    process.exit(0);

  } catch (error) {
    console.error("Migration Failed:", error);
    process.exit(1);
  }
};

migrate();