const mongoose = require("mongoose");

// Define the Todo schema
const TodoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  priority:{
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});

// Create the Todo model
module.exports = mongoose.model("Todo", TodoSchema);
