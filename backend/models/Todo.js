const mongoose = require("mongoose");

// Define the Todo schema
const TodoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
});

// Create the Todo model
module.exports = mongoose.model("Todo", TodoSchema);
